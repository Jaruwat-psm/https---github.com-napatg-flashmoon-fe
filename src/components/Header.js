import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import WalletIcon from '@mui/icons-material/Wallet';
import Swal from 'sweetalert2';
import { useWallet } from '../contexts/WalletContext';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Moon from '../Images/logo.png';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Web3 from 'web3';
import MetaMaskLogo from '../Images/Metamask.png';
import TokenPocketLogo from '../Images/Tokenpocket.jpg';
import TrustWalletLogo from '../Images/TrustWallet.png';
import BitgetLogo from '../Images/Bitget.png';
import '../Style.css';
import axios from 'axios';
const ButtonAppBar = forwardRef((props, ref) => {
  const [account, setAccount] = useState('');
  const [subAccount, setSubAccount] = useState('');
  const { walletConnected, setWalletConnected, walletAddress, setWalletAddress } = useWallet();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);
  const [Token, setToken] = useState('');
  const [web3, setWeb3] = useState(null);

  useImperativeHandle(ref, () => ({
    handleConnectMetaMask,
    handleConnectTokenPocket,
    handleConnectTrustWallet,
    handleConnectBitget,
    handleClickOpen,
    Disconnect
  }));

  const LogoImage = () => (
    <>
      {isMobile ? (
        <Link to='/'>
          <img src={Moon} style={{ height: '100%', width: '100%' }} alt="Logo" />
        </Link>
      ) : (
        <Link to='/'>
          <img src={Moon} style={{ height: '150px', marginRight: '16px' }} alt="Logo" />
        </Link>
      )}
    </>
  );

  const CheckAuth = async () => {
    // console.log(account)
    const myHeaders = new Headers();
    // myHeaders.append("EthereumAddress", `${account}`);
    myHeaders.append("Authorization", `Bearer ${Token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("https://api.depx.dev/api/FlashMoon/data", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  }

  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: Web3.utils.toHex(97),
            chainName: 'Binance Smart Chain',
            rpcUrls: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
            nativeCurrency: {
              name: 'Binance Coin',
              symbol: 'BNB',
            },
            blockExplorerUrls: ['https://testnet.bscscan.com']
          }
        ]
      });
    } catch (addError) {
      console.error('Failed to add network:', addError);
    }
  };

  const checkNetworkAndRequestAccounts = async (web3) => {
    const chainId = Number(await web3.eth.getChainId());
    if (chainId !== 97) {
      await switchToBSC();
      return null;
    }

    const accounts = await web3.eth.requestAccounts();
    if (accounts.length > 0) {
      return accounts[0];
    } else {
      Swal.fire({
        title: 'No Accounts',
        text: 'No accounts found. Please create an account in your wallet.',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal-custom-z-index'
        }
      });
      return null;
    }
  };

  const handleConnectMetaMask = async () => {
    const confirmation = await Swal.fire({
      title: "Connect to MetaMask?",
      text: "Do you want to connect to your MetaMask wallet?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Connect",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'swal-custom-z-index'
      }
    });

    if (confirmation.isConfirmed) {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const account = await checkNetworkAndRequestAccounts(web3);
          if (account) {
            setAccount(account);
            setWalletConnected(true);
            setWeb3(web3);
            // Swal.fire({
            //   title: "Connected!",
            //   text: `Connected with account: ${account}`,
            //   icon: 'success',
            //   confirmButtonText: 'Great!',
            //   customClass: {
            //     popup: 'swal-custom-z-index'
            //   }
            // });

            const firstFour = account.substring(0, 4);
            const lastThree = account.slice(-3);
            const sub = `${firstFour}${lastThree}`;
            setWalletAddress(sub);
            if (account) {
              const message = 'Please sign this message to authenticate with our app.';
              try {
                const signature = await window.ethereum.request({
                  method: 'personal_sign',
                  params: [message, account],
                });

                const response = await axios.post('https://api.depx.dev/api/auth/verify', {
                  message,
                  signature,
                  account,
                });
                if (response.data.success) {
                  setToken(response.data.token);
                  localStorage.setItem('token', response.data.token);
                  Swal.fire({
                    title: "Authentication Success",
                    text: account,
                    icon: 'success'
                  })
                  setOpen(false)
                  CheckAuth();
                } else {
                  alert('Authentication failed.');
                }
              } catch (error) {
                console.error('Error during authentication:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error connecting to Binance Smart Chain:', error);
          Swal.fire({
            title: 'Connection Error',
            text: 'Failed to connect to MetaMask.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal-custom-z-index'
            }
          });
        }
      } else {
        Swal.fire({
          title: 'MetaMask Not Installed',
          text: 'MetaMask is not installed. Please install it to use this feature.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-z-index'
          }
        });
      }
    }
  };

  const handleConnectTokenPocket = async () => {
    const confirmation = await Swal.fire({
      title: "Connect to Token Pocket?",
      text: "Do you want to connect to your Token Pocket wallet?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Connect",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'swal-custom-z-index'
      }
    });

    if (confirmation.isConfirmed) {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const account = await checkNetworkAndRequestAccounts(web3);
          if (account) {
            setAccount(account);
            setWalletConnected(true);
            // Swal.fire({
            //   title: "Connected!",
            //   text: `Connected with account: ${account}`,
            //   icon: 'success',
            //   confirmButtonText: 'Great!',
            //   customClass: {
            //     popup: 'swal-custom-z-index'
            //   }
            // });

            const firstFour = account.substring(0, 4);
            const lastThree = account.slice(-3);
            const sub = `${firstFour}${lastThree}`;
            setWalletAddress(sub);
            if (account) {
              const message = 'Please sign this message to authenticate with our app.';
              try {
                const signature = await window.ethereum.request({
                  method: 'personal_sign',
                  params: [message, account],
                });

                const response = await axios.post('https://api.depx.dev/api/auth/verify', {
                  message,
                  signature,
                  account,
                });
                if (response.data.success) {
                  setToken(response.data.token);
                  localStorage.setItem('token', response.data.token);
                  Swal.fire({
                    title: "Authentication Success",
                    text: account,
                    icon: 'success'
                  })
                  setOpen(false)
                  CheckAuth();
                } else {
                  alert('Authentication failed.');
                }
              } catch (error) {
                console.error('Error during authentication:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error connecting to Binance Smart Chain:', error);
          Swal.fire({
            title: 'Connection Error',
            text: 'Failed to connect to Token Pocket.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal-custom-z-index'
            }
          });
        }
      } else {
        Swal.fire({
          title: 'Token Pocket Not Installed',
          text: 'Token Pocket is not installed. Please install it to use this feature.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-z-index'
          }
        });
      }
    }
  };

  const handleConnectTrustWallet = async () => {
    const confirmation = await Swal.fire({
      title: "Connect to Trust Wallet?",
      text: "Do you want to connect to your Trust Wallet?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Connect",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'swal-custom-z-index'
      }
    });

    if (confirmation.isConfirmed) {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const account = await checkNetworkAndRequestAccounts(web3);
          if (account) {
            setAccount(account);
            setWalletConnected(true);
            // Swal.fire({
            //   title: "Connected!",
            //   text: `Connected with account: ${account}`,
            //   icon: 'success',
            //   confirmButtonText: 'Great!',
            //   customClass: {
            //     popup: 'swal-custom-z-index'
            //   }
            // });

            const firstFour = account.substring(0, 4);
            const lastThree = account.slice(-3);
            const sub = `${firstFour}${lastThree}`;
            setWalletAddress(sub);
            if (account) {
              const message = 'Please sign this message to authenticate with our app.';
              try {
                const signature = await window.ethereum.request({
                  method: 'personal_sign',
                  params: [message, account],
                });

                const response = await axios.post('https://api.depx.dev/api/auth/verify', {
                  message,
                  signature,
                  account,
                });
                if (response.data.success) {
                  setToken(response.data.token);
                  localStorage.setItem('token', response.data.token);
                  Swal.fire({
                    title: "Authentication Success",
                    text: account,
                    icon: 'success'
                  })
                  setOpen(false)
                  CheckAuth();
                } else {
                  alert('Authentication failed.');
                }
              } catch (error) {
                console.error('Error during authentication:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error connecting to Binance Smart Chain:', error);
          Swal.fire({
            title: 'Connection Error',
            text: 'Failed to connect to Trust Wallet.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal-custom-z-index'
            }
          });
        }
      } else {
        Swal.fire({
          title: 'Trust Wallet Not Installed',
          text: 'Trust Wallet is not installed. Please install it to use this feature.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-z-index'
          }
        });
      }
    }
  };

  const handleConnectBitget = async () => {
    const confirmation = await Swal.fire({
      title: "Connect to Bitget?",
      text: "Do you want to connect to your Bitget wallet?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Connect",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'swal-custom-z-index'
      }
    });

    if (confirmation.isConfirmed) {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const account = await checkNetworkAndRequestAccounts(web3);
          if (account) {
            setAccount(account);
            setWalletConnected(true);
            // Swal.fire({
            //   title: "Connected!",
            //   text: `Connected with account: ${account}`,
            //   icon: 'success',
            //   confirmButtonText: 'Great!',
            //   customClass: {
            //     popup: 'swal-custom-z-index'
            //   }
            // });

            const firstFour = account.substring(0, 4);
            const lastThree = account.slice(-3);
            const sub = `${firstFour}${lastThree}`;
            setWalletAddress(sub);
            if (account) {
              const message = 'Please sign this message to authenticate with our app.';
              try {
                const signature = await window.ethereum.request({
                  method: 'personal_sign',
                  params: [message, account],
                });

                const response = await axios.post('https://api.depx.dev/api/auth/verify', {
                  message,
                  signature,
                  account,
                });
                if (response.data.success) {
                  setToken(response.data.token);
                  localStorage.setItem('token', response.data.token);
                  Swal.fire({
                    title: "Authentication Success",
                    text: account,
                    icon: 'success'
                  })
                  setOpen(false)
                  CheckAuth();
                } else {
                  alert('Authentication failed.');
                }
              } catch (error) {
                console.error('Error during authentication:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error connecting to Binance Smart Chain:', error);
          Swal.fire({
            title: 'Connection Error',
            text: 'Failed to connect to Bitget.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'swal-custom-z-index'
            }
          });
        }
      } else {
        Swal.fire({
          title: 'Bitget Not Installed',
          text: 'Bitget is not installed. Please install it to use this feature.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-z-index'
          }
        });
      }
    }
  };

  const Disconnect = () => {
    setAccount('');
    setWalletConnected(false);
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected')
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isMobile ? (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
            <Toolbar sx={{ p: 2 }}>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                <LogoImage />
              </Typography>
              {walletConnected ? (
                <>
                  {/* <Typography style={{ marginRight: '30px' }}>{walletAddress}</Typography> */}
                  <Button sx={{ bgcolor: 'grey', color: 'white', fontSize: '1rem', borderRadius: 50 }} fullWidth variant='contained' onClick={Disconnect}>{walletAddress}</Button>
                </>
              ) : (
                <>
                  <Button sx={{ bgcolor: 'primary', color: 'white', borderRadius: 50 }} fullWidth variant='contained' onClick={handleClickOpen}>Connect Wallet</Button>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
            <Toolbar sx={{ p: 3 }}>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                <LogoImage />
              </Typography>
              {walletConnected ? (
                <>
                  <Typography style={{ marginRight: '10px' }}>Connected as: {walletAddress}</Typography>
                  <Button sx={{ bgcolor: 'grey', color: 'white', borderRadius: 50, "&:hover": { bgcolor: 'red' } }} size='large' variant='contained' onClick={Disconnect}>Disconnect</Button>
                </>
              ) : (
                <>
                  <Button sx={{ bgcolor: 'primary', color: 'white', borderRadius: 50 }} size='large' variant='contained' startIcon={<WalletIcon />} onClick={handleClickOpen}>Connect Wallet</Button>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{ zIndex: 1000 }}
      >
        <DialogTitle id="responsive-dialog-title">
          {"Choose your Wallet"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isMobile ? (
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
                <img
                  src={MetaMaskLogo}
                  alt="MetaMask"
                  style={{ width: 100, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectMetaMask}
                />
                <img
                  src={TokenPocketLogo}
                  alt="Token Pocket"
                  style={{ width: 100, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectTokenPocket}
                />
                <img
                  src={TrustWalletLogo}
                  alt="Trust Wallet"
                  style={{ width: 100, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectTrustWallet}
                />
                <img
                  src={BitgetLogo}
                  alt="Bitget"
                  style={{ width: 60, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectBitget}
                />
              </Box>
            ) : (
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <img
                  src={MetaMaskLogo}
                  alt="MetaMask"
                  style={{ width: 100, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectMetaMask}
                />
                <img
                  src={TokenPocketLogo}
                  alt="Token Pocket"
                  style={{ width: 120, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectTokenPocket}
                />
                <img
                  src={TrustWalletLogo}
                  alt="Trust Wallet"
                  style={{ width: 120, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectTrustWallet}
                />
                <img
                  src={BitgetLogo}
                  alt="Bitget"
                  style={{ width: 60, marginRight: 8, cursor: 'pointer' }}
                  className="img-hover-effect"
                  onClick={handleConnectBitget}
                />
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='error' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default ButtonAppBar;
