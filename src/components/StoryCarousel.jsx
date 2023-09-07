// import React, { useState } from "react";
// import "./StorySlider.scss";

// function StoryCarousel({ stories }) {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const prevSlide = () => {
//     setCurrentSlide((currentSlide + stories.length - 1) % stories.length);
//   };

//   const nextSlide = () => {
//     setCurrentSlide((currentSlide + 1) % stories.length);
//   };

//   return (
//     <div className="image-slider">
//       {/* <div className="slider-text">{stories[currentSlide].text}</div>
//       <div
//         className="slider-image"
//         style={{
//           backgroundImage: `url(${stories[currentSlide].image})`,
//         }}
//       /> */}
//       {stories[currentSlide].stories[0].type === "image" && <img style={{height: 300}} src={stories[currentSlide].stories[0].content} alt="Story" />}
//     {stories[currentSlide].stories[0].type === "text" && <p>{stories[currentSlide].stories[0].content}</p>}

//       <button className="prev-button" onClick={prevSlide}>
//         Prev
//       </button>
//       <button className="next-button" onClick={nextSlide}>
//         Next
//       </button>
//       <div
//         className="prev-slide"
//         style={{
//           backgroundImage: `url(${
//             stories[(currentSlide + stories.length - 1) % stories.length].image
//           })`,
//         }}
//       />
//       <div
//         className="next-slide"
//         style={{
//           backgroundImage: `url(${stories[(currentSlide + 1) % stories.length].image})`,
//         }}
//       />
//     </div>
//   );
// }

// export default StoryCarousel;



// import React from "react";
// import styled from "styled-components";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// function StoryCarousel({ stories }) {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//   };

//   return (
//     <Carousel {...settings}>
//       {stories.map((story) => (
//         <Wrap key={story.id}>
//           {/* <img src={story.image} alt={story.text} />
//           <StoryText>{story.text}</StoryText> */}
//           {story.stories[0].type === "image" && <img src={story.stories[0].content} alt="Story" />}
//         {/* {story.stories[0].type === "text" && <StoryText>{story.stories[0].content}</StoryText>} */}
//         </Wrap>
//       ))}
//     </Carousel>
//   );
// }

// export default StoryCarousel;

// const Carousel = styled(Slider)`
//   margin-top: 15px;

//   ul li button {
//     &:before {
//       font-size: 10px;
//       color: white;
//     }
//   }

//   li.slick-active button::before {
//     color: white;
//   }

//   .slick-list {
//     overflow: visible;
//   }

//   button {
//     z-index: 1;
//   }

//   &:hover {
//     box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
//       rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(250, 250, 250, 0.12) 0px 4px 6px,
//       rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(250, 250, 250, 0.09) 0px -3px 5px;
//     cursor: pointer;
//     transition: 400ms;
//   }
// `;

// const Wrap = styled.div`
  

//   img {
//     border-radius: 10px;
//     width: 100%;
//     height: 100%;
//     box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
//     transition: 300ms;

//     &:hover {
//       border: 4px solid rgba(250, 250, 250, 0.9);
//     }
//   }
// `;

// // const StoryText = styled.div`
// //   position: absolute;
// //   bottom: 0;
// //   left: 0;
// //   right: 0;
// //   padding: 10px;
// //   background-color: rgba(0, 0, 0, 0.7);
// //   color: white;
// //   font-size: 14px;
// //   border-bottom-left-radius: 10px;
// //   border-bottom-right-radius: 10px;
// // `;


import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const StoryCarousel = ({ stories }) => {
  return (
    <Carousel>
      {stories.map((story) => (
        <div key={story.id}>
          {story.type === 'image' && <img src={story.content} alt="Story" />}
          {story.type === 'text' && <p>{story.content}</p>}
          {/* You can add other story details here */}
        </div>
      ))}
    </Carousel>
  );
};

export default StoryCarousel;
