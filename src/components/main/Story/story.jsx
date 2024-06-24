import { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Story(props) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [data, setData] = useState([]);
  const [dataStory, setDataStory] = useState();
  const [open, setOpen] = useState(false);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          url: "https://localhost:4000/api/v1/feed/story",
          method: "get",
        });
        const result = await res.data?.data?.filter(
          (item) => item.type_post === "story"
        );
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up an interval to fetch data every X milliseconds
    const intervalId = setInterval(fetchData, 5000); // Replace 60000 with your desired interval in milliseconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run the effect only once on mount
  return (
    <>
      <Slider className="story" {...settings}>
        <div
          onClick={() => {
            props?.openModal();
            props?.setOpenFrom(true);
          }}
          className="story-item item"
          style={{
            backgroundImage:
              "url(https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg",
          }}
        >
          <div className="rounded" />
          <span>Create Story</span>
        </div>
        {data?.map((item, key) => (
          <div
            onClick={() => {
              setOpen(true);
              setDataStory(item);
            }}
            key={key}
            className="story-item item"
            style={{
              position: "relative",
              overflow: "hidden",
              backgroundImage: `url(${item?.author?.profilePicture?.url
                ? item?.author?.profilePicture?.url
                : "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"
                })`,
            }}
          >
            <img
              style={{
                position: "absolute",
                width: "100%",
                top: 0,
                height: "100%",
                left: 0,
                objectFit: "cover",
                borderRadius: 10,
              }}
              src={
                item?.photos?.[0]?.url
                  ? item?.photos?.[0]?.url
                  : "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"
              }
              alt=""
            />
            <div
              className="rounded"
              style={{
                backgroundImage: `url(${item?.author?.profilePicture?.url
                  ? item?.author?.profilePicture?.url
                  : "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"
                  })`,
              }}
            />
            <span>{(item?.author?.firstname && item?.author?.lastname) ? `${item?.author?.firstname} ${item?.author?.lastname}` : item?.author?.username}</span>
          </div>
        ))}
        {data?.length < 5 &&
          Array.from(Array(4 - data?.length).keys()).map((item, key) => (
            <div
              key={key}
              className="story-item item story-placeholder"
              style={{ opacity: 0 }}
            >
              <div className="rounded" />
              <span>Your Content</span>
            </div>
          ))}
      </Slider>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ zIndex: 99999 }}
      >
        <DialogTitle id="alert-dialog-title">
          {"Story's " + ((dataStory?.author?.firstname && dataStory?.author?.lastname) ? `${dataStory?.author?.firstname} ${dataStory?.author?.lastname}` : dataStory?.author?.username)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img
              style={{
                width: 400,
                top: 0,
                aspectRatio: 1 / 2,
                left: 0,
                objectFit: "cover",
                borderRadius: 10,
              }}
              src={
                dataStory?.photos?.[0]?.url
                  ? dataStory?.photos?.[0]?.url
                  : "https://4.img-dpreview.com/files/p/E~TS590x0~articles/3925134721/0266554465.jpeg"
              }
              alt=""
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Story;
