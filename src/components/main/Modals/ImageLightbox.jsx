import { useEffect, useState } from "react";
import Lightbox from 'react-image-lightbox';

const ImageLightbox = (props) => {
    const { images, isOpen, closeLightbox, activeIndex } = props;
    const [imgIndex, setImgIndex] = useState(activeIndex);
    console.log(images)
    useEffect(() => {
        setImgIndex(activeIndex);
    }, [activeIndex]);

    const onNext = () => {
        setImgIndex((imgIndex + 1) % images.length);
    }

    const onPrev = () => {
        setImgIndex((imgIndex + images.length - 1) % images.length);
    }

    return isOpen ? (
        <div className="relative">
            <Lightbox
                mainSrc={images[imgIndex]?.url}
                nextSrc={images[(imgIndex + 1) % images.length]?.url}
                prevSrc={images[(imgIndex + images.length - 1) % images.length]?.url}
                onCloseRequest={closeLightbox}
                onMovePrevRequest={onPrev}
                onMoveNextRequest={onNext}
                enableZoom={false}
                wrapperClassName="lightbox-wrapper"
                reactModalStyle={{
                    overlay: {
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    content: {
                        zIndex: 9999,
                        top: '60px',
                        // bottom: 'auto',
                        // left: 'auto',
                        // right: 'auto',
                        // marginRight: '-50%',
                        // transform: 'translate(-50%, -50%)'
                    }
                }}
            />
        </div>
    ) : null;
};

export default ImageLightbox;
