import axios from "axios";

const paystackUrl = "https://api.paystack.co";
export const verifyPayStackPayment = async (payRef) => {
    const { data } = await axios.get(
        `${paystackUrl}/transaction/verify/${payRef}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
            },
        }
    );
    return data.data;
};

export const refundPayStackPayment = async (payRef) => {
    const { data } = await axios.post(
        `${paystackUrl}/refund`,
        {
            transaction: payRef,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
            },
        }
    );
    return data.data;
};
