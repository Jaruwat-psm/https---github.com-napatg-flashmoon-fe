import React, {useState, useRef, useEffect, useContext} from 'react';
import ImageHeader from '../headerimage.png'
import Box from '@mui/material/Box';
import { Card, CardContent, Typography, Grid, Paper, IconButton, Button, Accordion, AccordionSummary, AccordionDetails, Container, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimelineIcon from '@mui/icons-material/Timeline'; 
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ButtonAppBar from './Header';
import { useNavigate } from "react-router-dom";
import WalletImage from '../Images/Item/Wallet.png'
import CircularProgress from '@mui/material/CircularProgress';
import { useWallet } from '../contexts/WalletContext';

import { isMobile } from 'web3modal';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image2 from '../Images/Slide/1.jpg'

function Contents() {
  const matches = useMediaQuery('(min-width:600px)');

  const { walletConnected } = useWallet();
  const [refID, setrefID] = useState('');
  const navigate = useNavigate();
  const [Loading, setLoding] = useState(false);
  function StatsCard({ icon, title, value, background,color }) {
    return (
      <Card sx={{ minWidth: 275, backgroundColor:{background}, color:'white', margin: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center">
            {icon}
            <Typography gutterBottom>
              {title}
            </Typography>
          </Box>
          <Typography variant="h5" component="div" sx={{fontWeight:700, color:{color}}}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const HeaderImage = () => {
    return <img src={ImageHeader} style={{borderRadius:10}} width='100%' height='100%' alt="Header" />;
  };

  const WalletImg = () => {
    return <img src={WalletImage} style={{borderRadius:10}} width='100%' height='100%' alt="Wallet"  />;
  };


  const data = [
    { id: 1, number: 306, code: "x1AB..C482", amount: "+ 40 USDT", date: "Sun Jun 23 2024" },
    { id: 2, number: 307, code: "x1AC..E492", amount: "+ 50 USDT", date: "Mon Jun 24 2024" },
    { id: 3, number: 308, code: "x1AD..F502", amount: "+ 60 USDT", date: "Tue Jun 25 2024" },
    { id: 1, number: 306, code: "x1AB..C482", amount: "+ 40 USDT", date: "Sun Jun 23 2024" },
    { id: 2, number: 307, code: "x1AC..E492", amount: "+ 50 USDT", date: "Mon Jun 24 2024" },
    { id: 3, number: 308, code: "x1AD..F502", amount: "+ 60 USDT", date: "Tue Jun 25 2024" },
    { id: 1, number: 306, code: "x1AB..C482", amount: "+ 40 USDT", date: "Sun Jun 23 2024" },
    { id: 2, number: 307, code: "x1AC..E492", amount: "+ 50 USDT", date: "Mon Jun 24 2024" },
    { id: 3, number: 308, code: "x1AD..F502", amount: "+ 60 USDT", date: "Tue Jun 25 2024" },
    { id: 1, number: 306, code: "x1AB..C482", amount: "+ 40 USDT", date: "Sun Jun 23 2024" },
    { id: 2, number: 307, code: "x1AC..E492", amount: "+ 50 USDT", date: "Mon Jun 24 2024" },
    { id: 3, number: 308, code: "x1AD..F502", amount: "+ 60 USDT", date: "Tue Jun 25 2024" },
  ];


  const handleClick = (refID) => {
    if (refID === null || refID === '') {
      alert('Please Fill RefID');
      return;
    }
    navigate(`/Dashboard/${refID}`);
  }

  const headerRef = useRef();

  const connectWallet = () => {
    if (headerRef.current) {
      headerRef.current.handleClickOpen();
    }
  };

  const Disconnected = () => {
    if (headerRef.current) {
      headerRef.current.Disconnect();
    }
  };

  useEffect(() => {
    setLoding(true);
    const timer = setTimeout(() => {
      setLoding(false)
    },500);

    return () => clearTimeout(timer)
  },[])

  return (
    <Container maxWidth="lg">
<Box sx={{color:'white'}}>
      <ButtonAppBar ref={headerRef} />
      {Loading ? (
      <Box sx={{justifyContent:'center', textAlign:'center'}}>
           <CircularProgress sx={{color:'white'}}/>
      </Box>
    ) : (
      <>
  <Grid container spacing={0}>
  <Grid item xs={12}>
  <Paper
      sx={{
        p: 4,
        borderRadius: 5,
        backgroundImage: `url(${Image2})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'black',
        height: 500
      }}
    >

{!matches ? (
<Box display={'flex'}>

</Box>
): (<>
<Box display={''}>
<Typography variant="h3" color="white">Welcome to </Typography>
<Typography variant="h3" color="white">
  <Box sx={{letterSpacing:10}}>FLASHMOON</Box>
  </Typography>
</Box>
<Box sx={{mt:3, color:'white'}}>
  Connect your wallet to be team.
  </Box>
  <Box sx={{mt:3}}>
    {walletConnected ? (<>
      <Button sx={{borderRadius:50, background:'grey', "&:hover":{bgcolor:'red'}}} size='large' variant="contained" color="primary" onClick={Disconnected}>
    Disconnect
  </Button>
    </>) : (
  <Button size='large' sx={{borderRadius:50}} variant="contained" color="primary" onClick={connectWallet}>
    Connect now
  </Button>
  )}
  </Box>
</>)}

  </Paper>
   
    </Grid>

{/* <Grid item xs={12} sx={{mt:3}}><ImageSlide/></Grid> */}
    {/* <Grid item xs={12} sx={{mt:3, textAlign:'end'}}>
  <Paper
      sx={{
        p: 4,
        borderRadius: 5,
        backgroundImage: `url(${WalletImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >

 
<Typography variant="h3" color="white">Welcome to The FLASHMOON</Typography>
  <Box sx={{mt:3}}>
  Connect your wallet to start working.
  </Box>
  <Box sx={{mt:3}}>
  </Box>
  <Button size='large' variant="contained" color="primary" onClick={connectWallet}>
    Connect now
  </Button>
    </Paper>
    </Grid> */}
  

      <Grid item xs={12} lg={7} sx={{mt:2}}>
      <Typography variant="h4" sx={{ mt: 2, fontWeight: '700' }}>
        Account preview
      </Typography>
      <Box sx={{ mt: 2, color: 'white' }}>
        Look up any member account in preview mode. Enter ID to preview.
      </Box>
      <Paper sx={{ p: 1, background: 'transparent' }}>
        <Box sx={{ display: 'flex', m: 2, alignItems: 'center' }}>
          <TextField
            id="input-with-icon-textfield"
            label="Example: 99"
            fullWidth
            value={refID}
            onChange={(e) => {
              setrefID(e.target.value);
            }}
            variant="filled"
            sx={{
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              '.MuiFilledInput-input': { color: 'black' },
            }}
          />
          <Button
            variant='contained'
            sx={{
              ml: 3,
              fontSize: 16,
              height: '50px', // ตั้งค่าความสูงให้ตรงกับ TextField
              borderRadius:2
            }}
            onClick={() => handleClick(refID)}
          >
            VIEW
          </Button>
        </Box>
      </Paper>
    </Grid>
<Grid item xs={12} lg={5} direction='row'>
    <StatsCard 
        title="Total Members" 
        value="9999" 
     background='rgba(51, 54, 52,0.8)'
     color="white"
      />
        <StatsCard 
        title="Members in last 24 hours" 
        value="+ 359" 
        background='rgba(51, 54, 52,0.8)'
           color="green"
      />
</Grid>
          
      </Grid>
      <Typography variant="h5" sx={{}}>Recent Activites</Typography>
      <Grid container spacing={2} sx={{mt:3}}>
      <Grid item xs={12} lg={7} sx={{ height: 400, overflowY: 'auto', padding: 2, '&::-webkit-scrollbar': {
        width: '10px'
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: '#f1f1f1'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'grey',
        '&:hover': {
          backgroundColor: '#555'
        }
      }
 }}>

    {data.map((item, index) => (
      <Paper sx={{ display: 'flex', alignItems: 'center', padding: 2, backgroundColor: 'rgba(71, 163, 238, 0.3)', color: 'white', mt:2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
        <IconButton color="inherit">
        <TimelineIcon />
            </IconButton>
            <Typography variant="body1" sx={{ marginRight: 1 }}>{item.number}</Typography>
            <Typography variant="body2" sx={{ opacity: 1 }}>{item.code}</Typography>
            <Typography variant="body1" sx={{ marginLeft: 1 }}>{item.amount}</Typography>
          </Box>
          <Typography variant="caption" sx={{ marginLeft: 'auto' }}>{item.date}</Typography>
        </Paper>
          
        ))}
      </Grid>
      <Grid item xs={12} lg={5} direction='row'>
  <Paper sx={{background:'transparent', boxShadow:0}}>

   
      <StatsCard 
        title="Income in last 24 hours, USDT" 
        value="$ 9999999" 
          background='rgba(51, 54, 52,0.8)'
             color="white"
      />

      <StatsCard 
        title="Total USDT Invested"
        value={"$ 99999999999"} 
          background='rgba(51, 54, 52,0.8)'
             color="white"
      />
          </Paper>
          </Grid>
      </Grid>
      
      <Typography variant="h5" sx={{ m:2 }}>FAQ's</Typography>

      <>
      <Accordion sx={{ mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography sx={{ fontWeight: 'bold' }}>What is FLASHMOON WEB3.0?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          FLASHMOON WEB3.0 is the international community of the global decentralized ecosystem and the first ever Binance Smart Contract marketing matrix. Please note, here when you pay to the platform, you are paying to buy nfts, while the matrix plan is an add on which is free to join once you purchase an nft. Once you have purchased an nft you are automatically a part of self-executing software algorithm that performs the function of distributing partner rewards between community members, subject to certain conditions (matrix marketing plan).
            <br/><br/>
            The contract code is publicly available. Information about transactions can always be viewed at the link bscscan.com. Once you have purchased an nft, you are the owner of the nft & you can find that nft in your dapp wallet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography sx={{ fontWeight: 'bold' }}>Who Manages The Platform?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The FLASHMOON WEB3.0 platform consists of self-executing trades, which do not permit anyone to interfere with the course of the transactions.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography sx={{ fontWeight: 'bold' }}>Who Created FLASHMOON WEB3.0?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Information about the creators of FLASHMOON WEB3.0 will be available soon.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography sx={{ fontWeight: 'bold' }}>What is an NFT?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            An NFT is a Non-Fungible Token, which is a unique digital asset that represents ownership of real-world or digital items such as art, music, videos, or other content.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <Typography sx={{ fontWeight: 'bold' }}>Which wallet should I use?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You should use a wallet that supports NFTs such as MetaMask, Trust Wallet, or other compatible wallets.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mt: 2, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', borderRadius: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="panel6a-content"
          id="panel6a-header"
        >
          <Typography sx={{ fontWeight: 'bold' }}>How to Buy an NFT if I have never done it before?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You can buy an NFT by following these steps: 1. Set up a compatible wallet. 2. Purchase some cryptocurrency (e.g., Ethereum). 3. Connect your wallet to an NFT marketplace. 4. Browse and purchase the NFT you like.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
    </>
      )}
    </Box>
    </Container>
  );
}

export default Contents;
