import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import '../Style.css'
import Image1 from '../Images/Slide/1.jpg'
import Typography from '@mui/material/Typography'
import Image3 from '../Images/Slide/Item1.png'
import Image4 from '../Images/Slide/item2.png'
import ImageMain from '../Images/Slide/Slidemain.png'
import useMediaQuery from '@mui/material/useMediaQuery';
const ImageSlide = () => {
    const matches = useMediaQuery('(min-width:600px)');
    const images = [
        "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
        "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
        "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    ];
    const responsiveSettings = [
        {
            breakpoint: 800,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 500,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ];
    return (
        <Slide slidesToScroll={1} slidesToShow={1} indicators={true} responsive={responsiveSettings}>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${ImageMain})`, backgroundPosition:'center' }}>
                {/* <Typography variant="h3" color="white">
                JOIN US MAKE THE FLASHMOON
                </Typography> */}
                </div>
            </div>
            <div className="each-slide-effect">
            <div style={{ 'backgroundImage': `url(${Image1})` }}>
         
                </div>
            </div>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${Image3})` }}>
                {/* <Typography variant="h3" color="white">Welcome to </Typography>
<Typography variant="h3" color="white">
  <Box sx={{letterSpacing:10}}>FLASHMOON</Box>
  </Typography>
  <Box sx={{color:'white'}}>
  Connect your wallet to start working.
  </Box> */}
  
                </div>
            </div>
            <div className="each-slide-effect">
            <div style={{ 'backgroundImage': `url(${Image4})` }}>

                </div>
            </div>
        </Slide>
    );
};

export default ImageSlide;