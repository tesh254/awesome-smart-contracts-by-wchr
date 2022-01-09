const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KifuPlatform", function () {
  let kifu;
  let owner;
  let addr1;
  let KifuPlatform;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    KifuPlatform = await ethers.getContractFactory("Kifu");
    kifu = await KifuPlatform.deploy();
  });

  describe("Transactions", () => {
    it("should create a creator account", async function () {
      kifu.connect(owner);

      console.log(owner.address);

      const now = new Date().toISOString();
      const createAccountTx = await kifu.createCreatorAccount("wchr", now);

      await createAccountTx.wait();

      expect(await kifu.getCreatorAccountName()).to.equal("wchr");
      expect(await kifu.getCreatorAccountBalance()).to.equal(0);
      expect(await kifu.getCreatorAccountCreatedAt()).to.equal(now);
    });

    it("should donate", async () => {
      kifu.connect(addr1);

      console.log(addr1.address);

      const creator = "0x89A96283f24BA0d6c8a68122857ebf5c48e7Ef7c";

      const donateAmountTx = await kifu.donate(creator);

      await donateAmountTx.wait();

      kifu.connect(owner);

      expect(await kifu.getCreatorAccountBalance()).to.equal(1000);
    });
  });
});
