import Razorpay from "razorpay";

const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
    console.error("Error: Razorpay keys are missing in environment variables.");
    process.exit(1);
}

const instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

async function createPlans() {
    try {
        console.log("Creating Basic Plan...");
        const basicPlan = await instance.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: "Aki Basic Plan",
                amount: 1999,
                currency: "USD",
                description: "Access to Basic features",
            },
        });
        console.log("Basic Plan Created:", basicPlan.id);

        console.log("Creating Premium Plan...");
        const premiumPlan = await instance.plans.create({
            period: "monthly",
            interval: 1,
            item: {
                name: "Aki Premium Plan",
                amount: 2999, // $29.99
                currency: "USD",
                description: "Access to Premium features",
            },
        });
        console.log("Premium Plan Created:", premiumPlan.id);

        console.log("\n--- UPDATE YOUR .env FILE WITH THESE VALUES ---");
        console.log(`NEXT_PUBLIC_BASIC_PLAN_ID=${basicPlan.id}`);
        console.log(`NEXT_PUBLIC_PREMIUM_PLAN_ID=${premiumPlan.id}`);
        console.log("-----------------------------------------------");

    } catch (error) {
        console.error("Error creating plans:", error);
    }
}

createPlans();
