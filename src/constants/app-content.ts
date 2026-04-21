export type AppContent = {
  title: string;
  disc: string;
  content: string;
};

export const privacyPolicy: AppContent = {
  title: "Privacy Policy",
  disc: "Data Protection & User Privacy Information",
  content: `
Carowna values the privacy of its users and is committed to protecting personal information.
We collect basic user information such as name, phone number, identification details, and booking information to provide and improve our services. This data is used strictly for verification, communication, and operational purposes.
Carowna does not sell or share user data with third parties except where required for service delivery (such as with vendors) or by law.
All user data is stored securely, and necessary measures are taken to prevent unauthorized access, misuse, or disclosure.
By using the platform, users consent to the collection and use of their information as outlined in this policy.
`,
};

export const termsAndConditions: AppContent = {
  title: "Terms & Conditions",
  disc: "Platform Usage & User Agreement",
  content: `
Carowna is an online platform that connects customers with vehicle owners, travel agencies, and service providers for transportation purposes. By using our platform, users agree to comply with all terms and conditions mentioned below.
All vehicles listed on Carowna are owned and managed by respective vendors or agencies. Carowna acts only as an intermediary platform and is not responsible for the direct condition, availability, or performance of the vehicles.
Users must provide valid identification details and, where applicable, a valid driving license. Any misuse, illegal activity, or violation of traffic laws during the booking period will be the sole responsibility of the user. In case of any damage to the vehicle, the user will be liable to bear the repair costs as per the assessment.
A security deposit may be collected at the time of booking. This amount will be refunded after the trip, subject to vehicle inspection and no policy violations.
All payments must be made through the platform or agreed channels. Carowna is not responsible for any direct transactions made outside the platform.
Carowna reserves the right to suspend or terminate any user or vendor account in case of suspicious activity, misuse, or violation of terms.
`,
};

export const cancellationAndRefundPolicy: AppContent = {
  title: "Cancellation & Refund Policy",
  disc: "Cancellation Timelines & Refund Processing",
  content: `
Bookings can be cancelled prior to the scheduled start time. Cancellations made well in advance may be eligible for a full or partial refund. Cancellations made within a short time before the trip or after the booking start time may not be eligible for any refund.
Refunds, if applicable, will be processed within a reasonable timeframe after deducting applicable charges. Once the trip has started, no refunds will be provided under any circumstances.
`,
};
