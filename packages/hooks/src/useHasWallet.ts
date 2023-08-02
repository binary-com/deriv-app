import useWalletsList from './useWalletsList';

const useHasWallet = () => {
    const { data: wallets } = useWalletsList();

    return wallets && wallets.length && wallets.length > 0;
};

export default useHasWallet;
