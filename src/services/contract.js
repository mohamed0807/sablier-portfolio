import { ethers } from "ethers";
//  const parsedEvent = this.contract.interface.parseLog(createFlowStreamEvent);
const findEvent = (receipt, eventName, contract) => {
  const eventData = receipt.logs.find((log) => {
    if (!log.data || !log.topics || log.topics.length === 0) return false;

    try {
      const parsedLog = contract.interface.parseLog({
        data: log.data,
        topics: log.topics,
      });
      return parsedLog?.name === eventName;
    } catch {
      return false;
    }
  });
  if (eventData) {
    return contract.interface.parseLog(eventData);
  } else {
    return null;
  }
};
export class SablierService {
  constructor(contract) {
    this.contract = contract;
  }

  async getBalance(address) {
    try {
      return await this.contract.balanceOf(address);
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }

  async getStreamById(streamId) {
    try {
      return await this.contract.getStream(streamId);
    } catch (error) {
      console.log("Error fetching stream:", error);
      return [];
    }
  }

  async getStreamBySender(sender) {
    try {
      return await this.contract.getStreamsBySender(sender);
    } catch (error) {
      console.log("Error fetching stream:", error);
      return [];
    }
  }

  async createStream(
    sender,
    recipient,
    ratePerSecond,
    tokenAddress,
    transferable,
    amount
  ) {
    try {
      const tokenAmount = ethers.parseUnits(amount.toString(), 18);
      const ratePerSecondParsed = ethers.parseUnits(
        ratePerSecond.toString(),
        18
      );

      const gasEstimate = await this.contract.createAndDeposit.estimateGas(
        sender,
        recipient,
        ratePerSecondParsed,
        tokenAddress,
        transferable,
        tokenAmount
      );

      const multiplier = 11n;
      const divisor = 10n;

      const finalGasPrice = Math.floor(
        Number((gasEstimate * multiplier) / divisor)
      );

      const tx = await this.contract.createAndDeposit(
        sender,
        recipient,
        ratePerSecondParsed,
        tokenAddress,
        transferable,
        tokenAmount,
        {
          gasLimit: finalGasPrice,
        }
      );

      const receipt = await tx.wait();

      if (receipt.status == 1) {
        const createFlowStreamEvent = this.contract.interface.parseLog({
          topics: receipt.logs[2].topics,
          data: receipt.logs[2].data,
        });
        return {
          status: true,
          streamId: createFlowStreamEvent.args[0],
        };
      } else {
        return { status: false };
      }
    } catch (error) {
      console.log(
        "Error creating stream:",
        error?.response?.data?.message || error?.message
      );
      return { status: false };
    }
  }

  async void(streamId, sender, walletAddress) {
    try {
      const recipient = await this.contract.getRecipient(streamId);

      if (sender !== walletAddress && recipient !== walletAddress) {
        return { status: false, message: "Only the sender can void" };
      }

      const gasEstimate = await this.contract.void.estimateGas(streamId);
      const multiplier = 11n;
      const divisor = 10n;

      const finalGasPrice = Math.floor(
        Number((gasEstimate * multiplier) / divisor)
      );

      const tx = await this.contract.void(streamId, {
        gasLimit: finalGasPrice,
      });
      const receipt = await tx.wait();
      if (receipt.status == 1) {
        const voidFlowStreamEvent = findEvent(
          receipt,
          "VoidFlowStream",
          this.contract
        );

        return { status: true, streamId: voidFlowStreamEvent.streamId };
      }
    } catch (error) {
      console.log(
        "Error Voiding Stream:",
        error?.response?.data?.message || error?.message
      );
      return { status: false };
    }
  }
  async adjustRatePerSecond(streamId, newRatePerSecond, sender, walletAddress) {
    try {
      if (sender !== walletAddress) {
        return {
          status: false,
          message: "Only the sender can perform this action",
        };
      }
      newRatePerSecond = ethers.parseUnits(newRatePerSecond.toString(), 18);

      const gasEstimate = await this.contract.adjustRatePerSecond.estimateGas(
        streamId,
        newRatePerSecond
      );
      const multiplier = 11n;
      const divisor = 10n;

      const finalGasPrice = Math.floor(
        Number((gasEstimate * multiplier) / divisor)
      );

      const tx = await this.contract.adjustRatePerSecond(
        streamId,
        newRatePerSecond,
        {
          gasLimit: finalGasPrice,
        }
      );
      const receipt = await tx.wait();
      if (receipt.status == 1) {
        const voidFlowStreamEvent = findEvent(
          receipt,
          "AdjustFlowStream",
          this.contract
        );

        return { status: true, streamId: voidFlowStreamEvent.streamId };
      }
    } catch (error) {
      console.log(
        "Error Voiding Stream:",
        error?.response?.data?.message || error?.message
      );
      return { status: false };
    }
  }
  async restartStream(streamId, newRatePerSecond, sender, walletAddress) {
    try {
      if (sender !== walletAddress) {
        return {
          status: false,
          message: "Only the sender can perform this action",
        };
      }
      newRatePerSecond = ethers.parseUnits(newRatePerSecond.toString(), 18);

      const gasEstimate = await this.contract.restart.estimateGas(
        streamId,
        newRatePerSecond
      );
      const multiplier = 11n;
      const divisor = 10n;

      const finalGasPrice = Math.floor(
        Number((gasEstimate * multiplier) / divisor)
      );

      const tx = await this.contract.restart(streamId, newRatePerSecond, {
        gasLimit: finalGasPrice,
      });
      const receipt = await tx.wait();
      if (receipt.status == 1) {
        const voidFlowStreamEvent = findEvent(
          receipt,
          "RestartFlowStream",
          this.contract
        );

        return { status: true, streamId: voidFlowStreamEvent.streamId };
      }
    } catch (error) {
      console.log(
        "Error Voiding Stream:",
        error?.response?.data?.message || error?.message
      );
      return { status: false };
    }
  }
  async pauseStream(streamId, sender, walletAddress) {
    console.log("PAUSE_STREAM_DATA", streamId, sender, walletAddress);
    try {
      if (sender !== walletAddress) {
        return {
          status: false,
          message: "Only the sender can perform this action",
        };
      }
      const gasEstimate = await this.contract.pause.estimateGas(streamId);
      const multiplier = 11n;
      const divisor = 10n;

      const finalGasPrice = Math.floor(
        Number((gasEstimate * multiplier) / divisor)
      );

      const tx = await this.contract.pause(streamId, {
        gasLimit: finalGasPrice,
      });
      const receipt = await tx.wait();
      if (receipt.status == 1) {
        const pauseStreamEvent = findEvent(
          receipt,
          "PauseFlowStream",
          this.contract
        );

        return { status: true, streamId: pauseStreamEvent.streamId };
      }
    } catch (error) {
      console.log(
        "Error pause Stream:",
        error?.response?.data?.message || error?.message
      );
      return { status: false };
    }
  }

  async deposit(streamId, amount, sender, walletAddress) {
    try {
      if (sender !== walletAddress) {
        return { status: false, message: "Only the recipient can withdraw" };
      }
      amount = ethers.parseUnits(amount.toString(), 18);

      const recipient = await this.contract.getRecipient(streamId);

      console.log("recipient", recipient);

      const gasEstimate = await this.contract.deposit.estimateGas(
        streamId,
        amount,
        sender,
        recipient
      );
      const multiplier = 11n;
      const divisor = 10n;

      const finalGasPrice = Math.floor(
        Number((gasEstimate * multiplier) / divisor)
      );

      const tx = await this.contract.deposit(
        streamId,
        amount,
        sender,
        recipient,
        {
          gasLimit: finalGasPrice,
        }
      );
      const receipt = await tx.wait();
      if (receipt.status == 1) {
        const depositStream = findEvent(
          receipt,
          "DepositFlowStream",
          this.contract
        );

        return { status: true, streamId: depositStream.streamId };
      }
    } catch (error) {
      console.log(
        "Error Voiding Stream:",
        error?.response?.data?.message || error?.message
      );
      return { status: false };
    }
  }

  async withdraw(streamId, walletAddress) {
    try {
      const recipient = await this.contract.getRecipient(streamId);

      if (recipient !== walletAddress) {
        return { status: false, message: "Only the recipient can withdraw" };
      }

      const gasEstimate = await this.contract.withdrawMax.estimateGas(
        streamId,
        recipient
      );
      const multiplier = 11n;
      const divisor = 10n;

      const finalGasPrice = Math.floor(
        Number((gasEstimate * multiplier) / divisor)
      );

      // const tokenAmount = ethers.parseUnits(amount.toString(), 18);
      const tx = await this.contract.withdrawMax(streamId, to, {
        gasLimit: finalGasPrice,
      });
      const receipt = await tx.wait();
      console.log("withdraw_receipt", receipt);
      return { status: receipt.status == 1 };
    } catch (error) {
      console.log(
        "Error Withdraw:",
        // error?.response?.data?.message || error?.message
        error
      );
      return { status: false };
    }
  }

  // Utility function to convert ratePerSecond to UD21x18 format (if necessary)
  _toUD21x18(ratePerSecond) {
    return ethers.BigNumber.from((ratePerSecond * 1e18).toString());
  }
}

export const contractInstance = (contract) => new SablierService(contract);
