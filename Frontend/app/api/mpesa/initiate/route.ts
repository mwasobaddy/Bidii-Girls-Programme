import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, msisdn, reference } = await request.json();

    // Validate required fields
    if (!amount || !msisdn || !reference) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: amount, msisdn, or reference",
        },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!/^254\d{9}$/.test(msisdn)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number format. Use 254XXXXXXXXX",
        },
        { status: 400 }
      );
    }

    // Get HashPay credentials from environment variables
    const API_KEY = process.env.HASHPAY_API_KEY;
    const ACCOUNT_ID = process.env.HASHPAY_ACCOUNT_ID;

    if (!API_KEY || !ACCOUNT_ID) {
      console.error("Missing HashPay credentials");
      return NextResponse.json(
        { success: false, message: "Payment service configuration error" },
        { status: 500 }
      );
    }

    // Prepare request data for HashPay API
    const hashpayData = {
      api_key: API_KEY,
      account_id: ACCOUNT_ID,
      amount: amount.toString(),
      msisdn: msisdn,
      reference: encodeURIComponent(reference),
    };

    console.log("Initiating HashPay STK Push:", {
      account_id: ACCOUNT_ID,
      amount: amount,
      msisdn: msisdn,
      reference: reference,
    });

    // Make request to HashPay API
    const hashpayResponse = await fetch(
      "https://api.hashback.co.ke/initiatestk",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(hashpayData),
      }
    );

    const hashpayResult = await hashpayResponse.json();
    console.log("HashPay API Response:", hashpayResult);

    if (hashpayResponse.ok && hashpayResult.ResultCode === "0") {
      return NextResponse.json({
        success: true,
        message: "M-Pesa payment initiated successfully",
        data: {
          reference: reference,
          amount: amount,
          phone: msisdn,
          transactionId: hashpayResult.CheckoutRequestID || reference,
        },
      });
    } else {
      // Handle specific error codes from HashPay
      let errorMessage = "Payment initiation failed";

      if (hashpayResult.error) {
        if (hashpayResult.error.code === 401) {
          errorMessage = "Invalid API credentials";
        } else if (hashpayResult.error.code === 429) {
          errorMessage = "Too many requests. Please try again later";
        } else {
          errorMessage = hashpayResult.error.message || "Payment service error";
        }
      } else if (hashpayResult.ResultDesc) {
        errorMessage = hashpayResult.ResultDesc;
      }

      console.error("HashPay API Error:", hashpayResult);

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("M-Pesa payment initiation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
