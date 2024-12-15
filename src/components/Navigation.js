import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import domo from 'ryuu.js';

const sliderData = [
  {
    title: "Revenue & Profit Analysis",
    buttonUrl: "https://gwcteq-partner.domo.com/app-studio/2141068563/pages/1300667438"
  },
  {
    title: "Warehouse Performance",
    buttonUrl: "https://gwcteq-partner.domo.com/app-studio/2141068563/pages/2111186333"
  },
  {
    title: "Client Performance Analysis",
    buttonUrl: "https://gwcteq-partner.domo.com/app-studio/2141068563/pages/1029967419"
  },
  {
    title: "Sustainability Analysis",
    buttonUrl: "https://gwcteq-partner.domo.com/app-studio/2141068563/pages/41773543"
  },
  {
    title: "Enquiry and Sales Pipeline Analysis",
    buttonUrl: "https://gwcteq-partner.domo.com/app-studio/2141068563/pages/1033151934"
  },
  {
    title: "Scenarios Analysis",
    buttonUrl: "https://gwcteq-partner.domo.com/app-studio/2141068563/pages/15176170"
  }
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sliderData.length - 1 : prevIndex - 1
    );
  };

  // const handleClick = (url) => {
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.target = '_self';
    
  //   // Simulate the Ctrl key press by dispatching a click event with the ctrlKey set to true
  //   const event = new MouseEvent('click', {
  //     bubbles: true,
  //     cancelable: true,
  //     ctrlKey: true
  //   });
    
  //   link.dispatchEvent(event);
  // };

   const handleClick = (url) => {
    domo.navigate(url, false)
  };

  return (
    <div className="w-full h-[250px] flex items-center justify-center overflow-hidden p-5 relative">
       <div className="absolute w-full flex items-center justify-center">
         {sliderData.map((slide, index) => {
           const isActive = index === currentIndex;
           const isPrevious = index === (currentIndex - 1 + sliderData.length) % sliderData.length;
           const isNext = index === (currentIndex + 1) % sliderData.length;

           let translateX = 0;
           let scale = 1;
           let opacity = 1;
           let zIndex = 1;

           if (isActive) {
             translateX = 0;
             scale = 1;
             zIndex = 10;
           } else if (isPrevious) {
             translateX = -100;
             scale = 0.8;
             opacity = 0.7;
           } else if (isNext) {
             translateX = 100;
             scale = 0.8;
             opacity = 0.7;
           } else {
             opacity = 0;
           }

           return (
             <div
               key={index}
               className="absolute w-[250px] h-[100px] transition-all duration-700 ease-out"
               style={{
                 transform: `translateX(${translateX}%) scale(${scale})`,
                 zIndex,
                 opacity
               }}
             >
               <div className="bg-[#013968] shadow-2xl rounded-2xl flex flex-col items-center p-3 border border-gray-200">
                 <h2 className="text-sm text-white font-bold text-center mb-4">
                   {slide.title}
                 </h2>
                 <button
                   onClick={() => handleClick(slide.buttonUrl)}
                   className="w-[150px] bg-[#fb8d34] text-white p-2 rounded-lg hover:bg-[#c77029] transition-colors text-center text-sm"
                 >
                   View Analysis
                 </button>
               </div>
             </div>
           );
         })}
       </div>
        
       {/* Navigation Buttons */}
       <button
          onClick={prevSlide}
          className="absolute left-[10%] top-1/2 -translate-y-1/2 bg-transparent p-2 rounded-full shadow-md hover:bg-transparent transition-colors z-20"
       >
         <ChevronLeft size={32} />
       </button>
       <button
          onClick={nextSlide}
          className="absolute right-[10%] top-1/2 -translate-y-1/2 bg-transparent p-2 rounded-full shadow-md hover:bg-transparent transition-colors z-20"
       >
         <ChevronRight size={32} />
       </button>
     </div>
   ); 
};

export default Slider;