import React, { useState, useEffect, useContext } from 'react';
import ImageHeader from '../Images/ImageRegist.jpg'
import Box from '@mui/material/Box';
import { Card, CardContent, Typography, Grid, Button, Container, ButtonGroup } from '@mui/material';
import Swal from 'sweetalert2'
import TextField from '@mui/material/TextField';
import ButtonAppBar from './Header';
import { useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import { useWallet } from '../contexts/WalletContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import Web3 from 'web3';
import abi from '../Abi/MyContract.json';
import { v4 as uuidv4 } from 'uuid';
import { getContract, getUsdtContract } from './FlashMoonSoldility';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers';
import usdtAbi from '../Abi/UsdtTokenAbi.json';

function Registers() {
  const { walletConnected } = useWallet();
  const [Balance, setBalance] = useState(false);
  const [Registration, setRegistration] = useState(true);
  const [NetworkConnect, setNetworkConnect] = useState(false);
  const [AgreementSigned, setAgreementSigned] = useState(false);
  const matches = useMediaQuery('(min-width:600px)');
  const [WalletAddress, setWalletAddress] = useState('');
  const [ContractAddress, setContractAddress] = useState('');
  const [gasPrice, setgasPrice] = useState('');
  const [Name, setName] = useState('');
  const [UserAddress, setUserAddress] = useState('');
  const [transactionFee, setTransactionFee] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [signature, setSignature] = useState('');
  const [message, setMessage] = useState('Please sign this message to authenticate with our app.');


  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.enable()
        .then(accounts => {
          setAccount(accounts[0]);
        })
        .catch((err) => console.error('Error enabling MetaMask', err));
    } else {
      alert('MetaMask is not installed');
    }
  }, []);


  const SignIn = async () => {
    const token = localStorage.getItem('token');

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    // ที่อยู่ของสัญญา USDT
    const usdtTokenAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
    // ABI ของสัญญา USDT
    const usdtTokenABI = usdtAbi;

    const usdtContract = await getUsdtContract();
    const contractAddress = '0x50C95112C574bca5D219a0059A8346a4a4c17A15';  // Replace with your smart contract address
    const amountInWei = parseUnits("24200", 18);

    const tx = await usdtContract.approve(contractAddress, amountInWei);
    await tx.wait();
    alert('Tokens approved successfully!');

    fetch("https://api.depx.dev/api/FlashMoon/GetRegisterSmContract", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        //  setContractAddress(result.contractAddress);
        //    setgasPrice(result.gasPrice);
        setName(result.name);
        setUserAddress(result.userAddress);
      })
      .catch((error) => console.error(error));
  }


  const register = async () => {
    await web3.eth.requestAccounts();
    if (!web3 || !account) {
      console.error('Web3 or account not initialized');
      return;
    }
    const contractAddress = '0x50C95112C574bca5D219a0059A8346a4a4c17A15';  // Replace with your smart contract address
    const contractABI = abi;
    let complete = "69c4551a-1165-4ec3-b456-cda45c23dd49";
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const tx = contract.methods.register(account, Name);
    const gasLimit = 300000;  // Adjust the gas limit as necessary
    const txData = tx.encodeABI();

    const transactionParameters = {
      to: contractAddress,
      from: account,
      gas: gasLimit,
      data: txData,
    };
    console.log(transactionParameters);
    try {
      // If you want to send the signed transaction, use this:
      const txHash = await web3.eth.sendTransaction(transactionParameters);
      console.log('Transaction hash:', txHash);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }

  };
  const signMessage = async () => {
    if (!web3 || !account) {
      console.error('Web3 or account not initialized');
      return;
    }
    try {
      const contractAddress = '0x50C95112C574bca5D219a0059A8346a4a4c17A15'; // Replace with your smart contract address
      const userAddress = account;
      const fullMessage = web3.utils.soliditySha3(contractAddress, userAddress);
      const signature = await web3.eth.sign(fullMessage, account);
      setSignature(signature);
      console.log('Signature:', signature);

      // Decode signature to v, r, s
      const r = signature.slice(0, 66);
      const s = '0x' + signature.slice(66, 130);
      const v = parseInt(signature.slice(130, 132), 16);
      console.log('r:', r);
      console.log('s:', s);
      console.log('v:', v);
      let isR = r.toString();
      let isV = v.toString();

      const contract = new web3.eth.Contract(abi, contractAddress);
      console.log("contract", contract);
      let newGuid = uuidv4();
      console.log("guid", newGuid);
      const recipients = ['0x963E611c0c0fE9BDb88a1b91Bbec3a0466616e04'];

      const amounts = [parseUnits("5", 18)]; // Convert amount to Wei
      const tx = contract.methods.createTransaction(recipients, amounts, v, r, s, newGuid);
      console.log("tx", tx);

      const gasLimit = 300000; // Adjust the gas limit as necessary
      const txData = tx.encodeABI();

      console.log("txData", txData);

      const transactionParameters = {
        to: contractAddress,
        from: account,
        gas: gasLimit,
        data: txData,
      };
      console.log(transactionParameters);

      try {
        // If you want to send the signed transaction, use this:
        const txHash = await web3.eth.sendTransaction(transactionParameters);
        console.log('Transaction hash:', txHash);
      } catch (error) {
        console.error('Error creating transaction:', error);
      }
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };

  let { Id } = useParams();

  function StatsCard({ icon, title, value }) {
    return (
      <Card sx={{ minWidth: 275, color: 'white', backgroundColor: 'rgba(71, 163, 238, 0.75)', margin: 2, border: 2, borderRadius: 3, borderColor: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center">
            {icon}
            <Typography>
              {title}
            </Typography>
          </Box>
          <Typography variant="h5" component="div" sx={{ mt: 2 }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const HeaderImage = () => {
    return <img src={ImageHeader} style={{ borderRadius: 10 }} width='100%' height='auto' alt="Header" />;
  };

  const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#FFFFFF',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FFFFFF',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FFFFFF',
      },
      '&:hover fieldset': {
        borderColor: '#FFFFFF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFFFFF',
      },
    },
  });

  return (
    <Container maxWidth="xl" sx={{ height: matches ? '100vh' : '100%' }}>
      <Box sx={{ color: 'white' }}>
        <ButtonAppBar />
        <Box sx={{ textAlign: 'center' }}></Box>
        <Grid container spacing={2} justifyContent='center' alignContent='center' sx={{ p: 3 }}>
          <Grid item xs={12} lg={4} direction='row'>
            <StatsCard
              icon={walletConnected ? <VerifiedIcon fontSize='large' sx={{ color: 'green' }} /> : <CancelIcon fontSize='large' color='error' />}
              value="Wallet Connected"
            />

            <StatsCard
              icon={Registration ? <VerifiedIcon fontSize='large' sx={{ color: 'green' }} /> : <CancelIcon fontSize='large' color='error' />}
              value="Registration"
            />

            <StatsCard
              icon={AgreementSigned ? <VerifiedIcon fontSize='large' sx={{ color: 'green' }} /> : <CancelIcon fontSize='large' color='error' />}
              value="Agreement Signed"
            />
          </Grid>

          <Grid item xs={12} lg={4} direction='row'>
            <StatsCard
              icon={NetworkConnect ? <VerifiedIcon fontSize='large' sx={{ color: 'green' }} /> : <CancelIcon fontSize='large' color='error' />}
              value="Network"
            />

            <StatsCard
              icon={Balance ? <VerifiedIcon fontSize='large' sx={{ color: 'green' }} /> : <CancelIcon fontSize='large' color='error' />}
              value="Balance ( >= 0 USDT )"
            />
          </Grid>

          <Grid item xs={12} lg={4} direction='row' justifyContent={"center"} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="white">
              Registration in FLASHMOON 3.0
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" color="white" sx={{ m: 3 }}>
                Sponsor
              </Typography>
              <CssTextField id="custom-css-outlined-input" fullWidth inputProps={{
                sx: {
                  color: 'white'
                }
              }} value={Id} />
            </Box>
            <ButtonGroup variant="contained" color="primary" aria-label="" size='large'>
              <Button variant='contained' sx={{ m: 0.5 }} onClick={SignIn}>Approve USDT</Button>
              <Button variant='contained' sx={{ m: 0.5 }} onClick={register}>Register</Button>
              <Button variant='contained' sx={{ m: 0.5 }} onClick={signMessage}>Home</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Registers;
