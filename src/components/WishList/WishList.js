import React, { useState, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import classNames from "classnames";

import { wishlistApi } from '../../apis';

import { UserContext } from "../../contexts/UserContext";
import { EffectContext } from "../../contexts/EffectApp";

import { Plus, Delete, NotfoundWishList } from "../../assets/images";
import { Loading } from "../";

import "./WishList.css";

export default function() {
  const { currentUser, setErr, setCurrentUser } = useContext(UserContext);
  const {
    isShowWishlist,
    isShowAddWishlist,
    handleShowWishlist,
    handleShowLayerWishlist
  } = useContext(EffectContext);

  const [goodsContentInput, setGoodsContentInput] = useState("");
  const [goodsListToAdd, setGoodsListToAdd] = useState([]);
  const [isLoadedData, setIsLoadedData] = useState(true);

  const addItem = () => {
    if (goodsContentInput === "") { }
    setGoodsListToAdd([...goodsListToAdd, goodsContentInput]);
  };

  const deleteItem = index => {
    setGoodsListToAdd([
      ...goodsListToAdd.slice(0, index),
      ...goodsListToAdd.slice(index + 1)
    ]);
  };

  const onSubmit = async () => {
    setIsLoadedData(false);

    try {
      const data = await wishlistApi.addWishlish({
        wishlist: goodsListToAdd,
        user: currentUser
      });
      setCurrentUser(data.data.userAfterAdd);
      setGoodsContentInput([]);
      handleShowWishlist(true, false);
      setIsLoadedData(true);

    } catch (err) {
      setErr(err);
      handleShowWishlist(false, false);
    }
  };

  const deleteItemOfWishList = async index => {
    //get data after delete
    const currentWishList = currentUser.myWishList;
    currentWishList.splice(index, 1);
    try {
      const data = await wishlistApi.removeItem({
        wishlist: currentWishList,
        user: currentUser
      })
      setCurrentUser(data.data.userAfterUpdate)
    } catch (err) {
      setErr(err);
      handleShowWishlist(false, false);
    }
  };

  const onClickToAddWishList = (e) => {
    e.preventDefault();
    setGoodsContentInput("");
    setGoodsListToAdd([]);
    handleShowWishlist(false, false);
    handleShowLayerWishlist();
  }

  return (
    <div>
      {isShowWishlist && (
        <div className="wishlist">
          {currentUser.myWishList.length > 0 && (
            <div className="my-wishlist">
              <h3>My wishlist</h3>
              <Scrollbars style={{ height: "200px" }}>
                <div className="wishlist-items">
                  {currentUser.myWishList.map((item, index) => (
                    <li key={index}>
                      <span>{item}</span>
                      <span onClick={() => deleteItemOfWishList(index)}>
                        <Delete />
                      </span>
                    </li>
                  ))}
                </div>
              </Scrollbars>
              <button
                onClick={() => {
                  handleShowWishlist(false, true);
                }}
                className="wishlist-update-btn"
              >
                UPdate
              </button>
            </div>
          )}
          {currentUser.myWishList.length === 0 && (
            <div className="wishlist-handle">
              <p>Bạn chưa có WishList của riêng mình, thêm ngay?</p>
              <img src={NotfoundWishList} alt="" />
              <div className="wishlist-action">
                <button
                  onClick={() => {
                    handleShowWishlist(false, true);
                  }}
                >
                  Thêm ngay
                </button>
                <button
                  onClick={() => {
                    handleShowWishlist(false, false);
                    handleShowLayerWishlist();
                  }}
                >
                  Để sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {isShowAddWishlist && (
        <div className="wishlist">
          <form>
            <div className="wishlist-form">
              <input
                placeholder="Add an item to your wishlist"
                value={goodsContentInput}
                onChange={e => setGoodsContentInput(e.target.value)}
              />
              <button
                className={classNames({
                  show: goodsContentInput.length > 0
                })}
                onClick={e => {
                  e.preventDefault();
                  addItem();
                  setGoodsContentInput("");
                }}
              >
                <Plus />
              </button>
            </div>
            <Scrollbars style={{ height: "200px" }}>
              {goodsListToAdd.length > 0 && (
                <div className="list-to-add">
                  {goodsListToAdd.length > 0 &&
                    goodsListToAdd.map((item, index) => (
                      <li key={index}>
                        <span>{item}</span>
                        <span onClick={() => deleteItem(index)}>
                          <Delete />
                        </span>
                      </li>
                    ))}
                </div>
              )}
              {goodsListToAdd.length === 0 && isLoadedData && (
                <div>
                  Chưa có danh sách để thêm vào, nhập vào input trên rồi nhấn
                  (+) để thêm
                </div>
              )}
              {goodsListToAdd.length === 0 && !isLoadedData && (
                <div>
                  <Loading />
                </div>
              )}
            </Scrollbars>
            <div className="wishlist-handle-add">
              <button
                onClick={e => {
                  e.preventDefault();
                  onSubmit();
                  setGoodsListToAdd([]);
                }}
                className={classNames({
                  show: goodsListToAdd.length > 0
                })}
              >
                Lưu
              </button>
              <button
                onClick={onClickToAddWishList}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
