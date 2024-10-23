import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";

interface Package {
  id: number;
  name: string;
  price: string;
  description: string;
  duration: number;
}

function App() {
  const [packages, setPackage] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPackages, setShowPackages] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const { contract_address, contract_balance, sendDeposit, sendBuyPackage } =
    useMainContract();

  const { connected } = useTonConnect();

  useEffect(() => {
    const fetchPackages = async () => {
      const response = await axios.get("http://localhost:3000/ton/all");
      setPackage(response.data);
    };

    fetchPackages();
  }, []);

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const togglePackages = () => {
    setShowPackages(!showPackages);
  };

  const toggleDeposit = () => {
    setShowDeposit(!showDeposit);
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value);
  };

  return (
    <>
      <div className="BT">
        <TonConnectButton />
      </div>

      <div className="Information">
        <br />
        <div className="Card">
          <b className="text">Our contract Address</b>
          <div className="Hint">{contract_address}</div>
          <b className="text">Our contract balance</b>
          <div className="Hint">
            <strong>{contract_balance !== null ? contract_balance : 0}</strong>
          </div>
        </div>
      </div>

      <div className="Function">
        <div className="Btn">
          <button onClick={togglePackages}>
            {showPackages ? "Hide Packages" : "Show Packages"}
          </button>
          {showPackages && (
            <div className="Text">
              {packages.map((pkg: Package) => (
                <div
                  key={pkg.id}
                  className="package-item"
                  onClick={() => handlePackageClick(pkg)}
                >
                  <h3>{pkg.name}</h3>
                  <p>Price: {pkg.price}</p>
                  <p>Description: {pkg.description}</p>
                  <p>Duration: {pkg.duration} month</p>
                </div>
              ))}

              <div>
                {selectedPackage && (
                  <div className="BuyContainer">
                    <button className="BtnBuy">
                      {connected && (
                        <a
                          onClick={() => {
                            sendBuyPackage(
                              selectedPackage.id,
                              selectedPackage.name,
                              selectedPackage.price,
                              selectedPackage.description,
                              selectedPackage.duration
                            );
                          }}
                          className="Buy"
                        >
                          Buy Package
                        </a>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="Btn">
          <button onClick={toggleDeposit}>
            {showDeposit ? "Hide Deposit" : "Show Deposit"}
          </button>
          {showDeposit && (
            <div className="Deposit">
              <input
                type="number"
                placeholder="Enter deposit amount"
                onChange={handleDepositChange}
              />
              {depositAmount && (
                <button className="BtnDeposit">
                  {connected && (
                    <a
                      onClick={() => {
                        sendDeposit(depositAmount);
                      }}
                      className="Deposit"
                    >
                      Deposit
                    </a>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
