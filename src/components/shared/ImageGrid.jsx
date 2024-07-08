import React, { useEffect, useState } from "react";
import { ImageLightbox } from "../../components/main";
import { useModal } from "../../hooks";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { EyeInvisibleOutlined } from '@ant-design/icons';

const ImageGrid = ({ images }) => {
  const { isOpen, closeModal, openModal } = useModal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPostVideo, setIsPostVideo] = useState(false);
  const [showImage, setShowImage] = useState(Array(images.length).fill(false));

  const onClickImage = (e) => {
    if (e.target.dataset && !e.target.dataset.isViolence) {
      const idx = e.target.dataset.index;
      setActiveIndex(idx);
      setTimeout(openModal, 100);
    }
  };

  const onCloseLightbox = () => {
    closeModal();
    setActiveIndex(0);
  };

  function isMP4(url) {
    var pattern = /\.mp4($|\?)/i;
    return pattern.test(url);
  }

  useEffect(() => {
    if (isMP4(images[0])) {
      setIsPostVideo(true);
    }
  }, [images]);

  const handleShowImage = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedShowImage = [...showImage];
    updatedShowImage[index] = true;
    setShowImage(updatedShowImage);
  };

  const renderGrid = () => {
    if (isMP4(images[0])) {
      return (
        <div className="custom-grid">
          <video
            controls
            autoPlay
            src={images[0]}
            alt="Can't open video"
            className="grid-img"
            data-index={0}
            style={{ marginBottom: 20 }}
          />
        </div>
      );
    }

    const gridStyles = {
      display: 'grid',
      gap: '5px',
      gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(2, 1fr)',
      gridTemplateRows: images.length === 3 ? 'repeat(2, 1fr)' : images.length <= 2 ? 'auto' : 'repeat(2, 1fr)',
    };

    const lastImageIndex = images.length - 1;
    const isOdd = images.length % 2 !== 0;

    return (
      <Box style={gridStyles}>
        {images.map((image, index) => (
          <Box
            key={index}
            className="custom-grid"
            position="relative"
            gridColumn={isOdd && index === lastImageIndex ? 'span 2' : 'span 1'}
          >
            <img
              src={image.url}
              alt="Grid"
              className="grid-img"
              data-index={index}
              data-isViolence={image.isViolence}
              style={{
                filter: image.isViolence && !showImage[index] ? "blur(20px)" : "none",
                cursor: image.isViolence && !showImage[index] ? "default" : "pointer",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onClick={image.isViolence && !showImage[index] ? null : onClickImage}
            />
            {image.isViolence && !showImage[index] && (
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                bgcolor="rgba(0, 0, 0, 0.5)"
                zIndex="1"
                color="white"
                textAlign="center"
                p={2}
                onClick={e => { e.stopPropagation(); }}
              >
                <EyeInvisibleOutlined style={{ fontSize: '3rem', color: 'white' }} />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleShowImage(e, index)}
                  style={{ marginTop: 8 }}
                >
                  Xem hình ảnh
                </Button>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <>
      <div className="w-full overflow-hidden" onClick={(e) => !isPostVideo && onClickImage(e)}>
        {renderGrid()}
      </div>
      <ImageLightbox
        activeIndex={activeIndex}
        isOpen={isOpen}
        closeLightbox={onCloseLightbox}
        images={images.filter((image, index) => !image.isViolence || showImage[index])}
      />
    </>
  );
};

export default ImageGrid;
