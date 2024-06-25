import { CoffeeOutlined, UndoOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { withAuth } from "../../components/hoc";
import {
  CreatePostModal,
  PostItem,
  PostModals,
  SuggestedPeople,
} from "../../components/main";
import { Avatar, Loader, PostLoader } from "../../components/shared";
import Story from "../../components/main/Story/story";
import { SUGGESTED_PEOPLE } from "../../constants/routes";
import { useDocumentTitle, useModal } from "../../hooks";
import {
  clearNewsFeed,
  createPostStart,
  deleteFeedPost,
  getNewsFeedStart,
  hasNewFeed,
  updateFeedPost,
  updatePostLikes,
} from "../../redux/action/feedActions";
import socket from "../../socket/socket";
import SideMenu from "./SideMenu";
import * as Tab from "../profile/Tabs";
import axios from "axios";
import { api } from "../../services/fetcher";

const Home = (props) => {
  const state = useSelector(
    (state) => ({
      newsFeed: state.newsFeed,
      auth: state.auth,
      error: state.error.newsFeedError,
      isLoadingFeed: state.loading.isLoadingFeed,
      isLoadingCreatePost: state.loading.isLoadingCreatePost,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const { isOpen, openModal, closeModal } = useModal();
  const [openFrom, setOpenFrom] = useState(false);
  const [change, setChange] = useState(false);
  const from = props.location.state?.from || null;

  useDocumentTitle("Social Network");
  useEffect(() => {
    console.log("TRIGGER", from);
    if (state.newsFeed.items.length === 0 || from === "/") {
      dispatch(clearNewsFeed());
      dispatch(getNewsFeedStart({ offset: 0 }));
    }

    socket.on("newFeed", () => {
      dispatch(hasNewFeed());
    });
    // Cleanup: Gỡ bỏ listener khi component unmount
    return () => {
      socket.off("newFeed");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNewsFeed = () => {
    dispatch(getNewsFeedStart({ offset: state.newsFeed.offset }));
  };

  const likeCallback = (postID, state, newLikeCount) => {
    dispatch(updatePostLikes(postID, state, newLikeCount));
  };

  const updateSuccessCallback = (post) => {
    dispatch(updateFeedPost(post));
  };

  const deleteSuccessCallback = (postID) => {
    dispatch(deleteFeedPost(postID));
  };

  const dispatchCreatePost = (form) => {
    dispatch(createPostStart(form));
  };

  const onClickNewFeed = () => {
    dispatch(clearNewsFeed());
    dispatch(getNewsFeedStart({ offset: 0 }));
    dispatch(hasNewFeed(false));
  };

  const infiniteRef = useInfiniteScroll({
    loading: state.isLoadingFeed,
    hasNextPage: !state.error && state.newsFeed.offset > 0,
    onLoadMore: fetchNewsFeed,
    scrollContainer: "window",
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // console.log(data)
      try {
        const res = await axios({
          url: `${api}/feed?offset=0`,
          method: "get",
        });
        console.log(res.data.data);
        setData(res.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      // dispatch(clearNewsFeed());
      // dispatch(getNewsFeedStart({ offset: 0 }));
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="laptop:px-6% pt-20 flex items-start">
      {/*  --- SIDE MENU --- */}
      <div className="hidden laptop:block laptop:w-1/4 laptop:rounded-md bg-white laptop:sticky laptop:top-20 mr-4 laptop:shadow-lg divide-y-2 dark:bg-indigo-1000">
        {props.isAuth && (
          <SideMenu
            username={state.auth.username}
            profilePicture={state.auth.profilePicture?.url}
          />
        )}
      </div>
      <div className="w-full laptop:w-2/4 relative">
        {/* --- CREATE POST INPUT ---- */}
        <Story
          data={state}
          isOpen={isOpen}
          change={change}
          openModal={openModal}
          closeModal={closeModal}
          setOpenFrom={setOpenFrom}
        />
        {props.isAuth && (
          <div className="flex items-center justify-start mb-4 px-4 laptop:px-0">
            <Avatar url={state.auth.profilePicture?.url} className="mr-2" />
            <div className="flex-grow">
              <input
                className="dark:bg-indigo-1000 dark:!border-gray-800 dark:text-white"
                type="text"
                placeholder="Create a post."
                onClick={() => {
                  if (!state.isLoadingCreatePost && !state.isLoadingFeed) {
                    openModal();
                    setOpenFrom(false);
                  }
                }}
                readOnly={state.isLoadingFeed || state.isLoadingCreatePost}
              />
            </div>
          </div>
        )}
        {/*  --- HAS NEW FEED NOTIF --- */}
        {state.newsFeed.hasNewFeed && (
          <button
            className="sticky mt-2 top-16 left-0 right-0 mx-auto z-20 flex items-center"
            onClick={onClickNewFeed}
          >
            <UndoOutlined className="flex items-center justify-center text-xl mr-4" />
            New Feed Available
          </button>
        )}
        {/* --- CREATE POST MODAL ----- */}
        {props.isAuth && isOpen && (
          <CreatePostModal
            isOpen={isOpen}
            openModal={openModal}
            closeModal={closeModal}
            openFrom={openFrom}
            dispatchCreatePost={dispatchCreatePost}
          />
        )}
        {state.error &&
          state.newsFeed.items.length === 0 &&
          !state.isLoadingCreatePost && (
            <div className="flex flex-col w-full min-h-24rem px-8 items-center justify-center text-center">
              {state.error.status_code === 404 ? (
                <>
                  <CoffeeOutlined className="text-8xl text-gray-300 mb-4 dark:text-gray-800" />
                  <h5 className="text-gray-500">News feed is empty</h5>
                  <p className="text-gray-400">
                    Start following people or create your first post.
                  </p>
                  <br />
                  <Link
                    className="underline dark:text-indigo-400"
                    to={SUGGESTED_PEOPLE}
                  >
                    See Suggested People
                  </Link>
                </>
              ) : (
                <h5 className="text-gray-500 italic">
                  {state.error?.error?.message || "Something went wrong :("}
                </h5>
              )}
            </div>
          )}
        {/* ---- LOADING INDICATOR ----- */}
        {state.isLoadingFeed && state.newsFeed.items.length === 0 && (
          <div className="mt-4 px-2 overflow-hidden space-y-6 pb-10">
            <PostLoader />
            <PostLoader />
          </div>
        )}
        {state.isLoadingCreatePost && (
          <div className="mt-4 px-2 overflow-hidden pb-10">
            <PostLoader />
          </div>
        )}
        {!props.isAuth && !state.isLoadingFeed && (
          <div className="px-4 laptop:px-0 py-4 mb-4">
            <h2 className="dark:text-white">
              Public posts that might <br />
              interest you.
            </h2>
          </div>
        )}
        {/* ---- NEWS FEED ---- */}
        {(data.length > 0 ? data : state.newsFeed.items).length !== 0 && (
          <div className="mb-8">
            <TransitionGroup component={null}>
              <div ref={infiniteRef}>
                {(data.length > 0 ? data : state.newsFeed.items)
                  ?.filter((item) => item.type_post != "story")
                  .map(
                    (post) =>
                      post.author && ( // avoid render posts with null author
                        <CSSTransition
                          timeout={500}
                          classNames="fade"
                          key={post.id}
                        >
                          <PostItem
                            key={post.id}
                            post={post}
                            likeCallback={likeCallback}
                          />
                        </CSSTransition>
                      )
                  )}
              </div>
            </TransitionGroup>
            {state.isLoadingFeed && (
              <div className="flex justify-center py-6">
                <Loader />
              </div>
            )}
            {state.error && (
              <div className="flex justify-center py-6">
                <p className="text-gray-400 italic">
                  {state.error.error?.message || "Something went wrong."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* --- SUGGESTED PEOPLE --- */}
      <div className="hidden laptop:block laptop:w-1/4 laptop:sticky laptop:top-20 ml-4">
        {props.isAuth && <SuggestedPeople />}
        {/* new feature */}
        <div style={{ marginTop: 16 }}>
          {props?.isAuth && (
            <>
              <Tab.Following
                is_page_home={true}
                username={state.auth.username}
              />
            </>
          )}
        </div>
      </div>
      {/*  --- ALL POST MODALS (DELETE COMMENT NOT INCLUDED) --- */}
      <PostModals
        deleteSuccessCallback={deleteSuccessCallback}
        updateSuccessCallback={updateSuccessCallback}
      />
    </div>
  );
};

export default withAuth(Home);
