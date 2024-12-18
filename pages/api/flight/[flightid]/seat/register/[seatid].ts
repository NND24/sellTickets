// pages/api/flight/[flightid]/seat/register/[seatid].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { registerSeat, readData } from "../../../../../../util/firebase";
import { scheduleSeatReset, getTimeOut } from "../../../../../../util/schedule";
import logger from "../../../../../../util/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { flightid, seatid } = req.query;
  const { userId } = req.body;
  const { passengerDetails, registerTime } = req.body;
  // const { honorifics, firstName, lastName, dateOfBirth, email, contactName, contactType, countryCode, phonenumber} = infomation

  if (req.method === "POST") {
    if (!flightid || !seatid || !userId) {
      return res.status(400).json({ error: "Flight ID, Seat ID, and User ID are required" });
    }

    try {
      // Check if seat is available
      const seatPath = `flights/${flightid}/seats/${seatid}`;
      const seatData = await readData(seatPath);

      if (seatData.status !== "free") {
        return res.status(409).json({ error: "Seat is not available for registration" });
      }

      let registeredBy = {
        userId,
        timestamp: registerTime,
      };

      // Update seat status to register
      const updatedSeatData = {
        status: "register",
        registeredBy,
        passengerDetails: passengerDetails,
      };
      await registerSeat(seatPath, updatedSeatData);
      scheduleSeatReset(flightid as string, seatid as string, registerTime, registeredBy);
      logger.info("[Task scheduling] _ Schedule set for " + getTimeOut() + "s");
      logger.info(`[200] - [${userId}] Seat registered successfully`);
      return res.status(200).json({ message: "Seat registered successfully", seat: updatedSeatData });
    } catch (error) {
      if (error.message == "Transaction aborted, seat is not free") {
        logger.info(`[409] - [${userId}] Seat is not free -> cancel this user`);
        return res.status(409).json({ error: "Conflict", detail: error.message });
      }
      logger.info(`[500] - [${userId}] Internal server error`);
      return res.status(500).json({ error: "Internal server error", detail: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
