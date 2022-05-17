const Routes = {
  // Tabs Screens:
  NFTS: 'NFTs',
  TOKENS: 'Tokens',
  PROFILE_SCREEN: 'Profile',
  SWIPE_LAYOUT: 'SwipeLayout',
  // Auth Screens:
  LOGIN_SCREEN: 'LoginScreen',
  WELCOME_SCREEN: 'WelcomeScreen',
  CREATE_PASSWORD: 'CreatePassword',
  IMPORT_SEED_PHRASE: 'ImportSeedPhrase',
  BACKUP_SEED_PHRASE: 'BackupSeedPhrase',
  //Error Screens:
  CONNECTION_ERROR: 'ConnectionError',
  //Wallet Connect:
  WALLET_CONNECT_APPROVAL_SHEET: 'WalletConnect',
  WALLET_CONNECT_CALL_REQUEST: 'WalletConnectCallRequest',
};

export const NATIVE_ROUTES = Object.values(Routes);

export default Routes;
