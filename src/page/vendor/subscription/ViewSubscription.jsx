import { CreditCard, ShoppingCart } from "lucide-react";

const tabs = [
  { id: "subscriptions", label: "My Subscriptions", icon: CreditCard },
  { id: "purchase", label: "Purchase Plan", icon: ShoppingCart },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("subscriptions");

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mx-auto mb-8 max-w-md">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-200 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center cursor-pointer justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content details fo */}
        {activeTab === "subscriptions" && <MySubscriptions />}
        {activeTab === "purchase" && <VendorSubscriptionPage />}
      </div>
    </div>
  );
};

export default Index;


import { CalendarDays, RefreshCw, Zap } from "lucide-react";

const statusStyles = {
  active: "bg-green-400 text-white border-gray-300",
  upgraded: "bg-yellow-500 text-white border-gray-100",
};

// constants/theme.js
const theme = {
  cardBg: "#ffffff",
  cardBorder: "#f3f4f6",       // gray-100
  cardShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",

  titleColor: "#1f2937",       // gray-800
  mutedColor: "#6b7280",       // gray-500
  foreground: "#0f172a",

  divider: "#e5e7eb",          // gray-200

  // Status badge colors — change here anytime
  statusActive: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#16a34a",
  },
  statusUpgraded: {
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#2563eb",
  },
}

export const MySubscriptions = () => {
  const { data, isLoading } = useViewSubscriptionListQuery();
  // console.log("Dd", data)
  
  // Update localStorage with credits from subscription data
  useEffect(() => {
    if (data?.data?.credits) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.remaining_credits = data?.data?.credits;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Dispatch custom event to notify AuthProvider of localStorage change
      window.dispatchEvent(new CustomEvent('localStorageUserUpdate'));
    }
  }, [data]);
  
  if (isLoading) {
    return <Loader />
  }



  const subscriptions = data?.data?.plans?.map((sub) => ({
    id: sub.plan_id,
    name: sub.name,
    status: sub.status,
    country:sub?.country,
    currency:sub?.price?.currency,
    price: sub.price.amount,
    interval: sub.price.billing_cycle,
    usage: sub.usage.percentage,
    usageLabel: `Credits used (${sub?.usage?.used}/${sub?.usage?.total} ${sub?.usage?.unit})`,
    startDate: new Date(sub.timeline.started_at).toLocaleDateString(),
    nextBilling: new Date(sub.timeline.next_billing_date).toLocaleDateString(),
  }))


  const headerDetail = [
    { icon: Zap, label: "Active Plans", value: data?.data?.summary?.active_plans ?? 0, color: "green" },
    { icon: CreditCard, label: "Monthly Spend", value: `${data?.data?.summary?.monthly_spend ?? 0} ${data?.data?.summary?.currency}`, color: "red" },
    { icon: RefreshCw, label: "Next Renewal", value: new Date(data?.data?.summary?.next_renewal).toLocaleDateString('en-GB').replace(/\//g, '-'), color: "blue" },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <p className="text-sm  text-blue-900">{`Sending a test link costs ${data?.data?.credits_per_test_link??0} credit. Your available credits will be reduced accordingly.`}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {headerDetail?.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}-600`}>
                <stat.icon className={`h-5 w-5 text-white`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-500">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription List */}
      <div className="space-y-4">
        {subscriptions?.length > 0 && subscriptions.map((sub) => {

          const statusStyle = sub.status === "active" ? theme.statusActive : theme.statusUpgraded

          return (
            <div
              key={sub.id}
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                boxShadow: theme.cardShadow,
              }}
              className="rounded-lg border overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h3
                      style={{ color: theme.titleColor }}
                      className="text-lg font-semibold"
                    >
                      {sub.name}
                    </h3>
                    <span
                      style={{
                        backgroundColor: statusStyle.bg,
                        borderColor: statusStyle.border,
                        color: statusStyle.text,
                      }}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                    >
                      {sub.status === "active" ? "Active" : "Upgraded"}
                    </span>
                    <span
                      style={{
                        // backgroundColor: 'green',
                        borderColor: statusStyle.border,
                        color: 'green',
                      }}
                      className="inline-flex items-center  rounded-full border px-4 py-1 text-xs "
                    >
                      {sub.country}
                    </span>

                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      // style={{ color: theme.foreground }}
                      className="text-xl text-gray-700 font-bold"
                    >
                    {sub?.currency}  {sub.price}
                    </span>
                    <span
                      style={{ color: theme.mutedColor }}
                      className="text-sm"
                    >
                      /{sub.interval}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-4 space-y-4">
                {sub.status && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: theme.mutedColor }}>{sub.usageLabel}</span>
                      <span style={{ color: theme.foreground }} className="font-medium">{sub.usage}%</span>
                    </div>
                  </div>
                )}

                <hr style={{ borderColor: theme.divider }} />

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span style={{ color: theme.mutedColor }} className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Started: {sub.startDate}
                    </span>
                    <span style={{ color: theme.mutedColor }} className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Next billing: {sub.nextBilling}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};


import { useState, useEffect } from "react";
// import SubscriptionCard from "./SubscriptionCard";

const plans = [
  {
    name: "Starter",
    price: 9,
    interval: "month",
    features: [
      "Up to 5 projects",
      "Email support",
      "1 GB storage",
      "Basic analytics",
      "Community access",
    ],
  },
  {
    name: "Pro",
    price: 29,
    interval: "month",
    isPopular: true,
    isCurrentPlan: true,
    features: [
      "Unlimited projects",
      "Priority support",
      "100 GB storage",
      "Advanced analytics",
      "Custom integrations",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: 99,
    interval: "month",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Unlimited storage",
      "Custom SLAs",
      "SSO & SAML",
      "On-premise deployment",
      "24/7 phone support",
    ],
  },
];

export const PurchaseSubscription = () => {
  const [billingInterval, setBillingInterval] = useState("month");
  let basePrice = 4
  const getPrice = () =>
    billingInterval === "year" ? Math.round(basePrice * 10) : basePrice;

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingInterval("month")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${billingInterval === "month"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingInterval("year")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${billingInterval === "year"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Yearly
          <span className="ml-1.5 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
            Save 17%
          </span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <SubscriptionCard
            key={plan.name}
            name={plan.name}
            price={getPrice(plan.price)}
            interval={billingInterval === "year" ? "year" : "mo"}
            features={plan.features}
            isPopular={plan.isPopular}
            isCurrentPlan={plan.isCurrentPlan}
            onSelect={() => alert(`Selected ${plan.name} plan!`)}
          />
        ))}
      </div>

      {/* Trust */}
      <p className="text-center text-sm text-muted-foreground">
        All plans include a 14-day free trial. Cancel anytime, no questions asked.
      </p>
    </div>
  );
};

//  default PurchaseSubscription;

import { Check } from "lucide-react";
import VendorSubscriptionPage from "./Subscription";
import Loader from "../../../libs/Loader";
import { useViewSubscriptionListQuery } from "../../../redux/services/vendorApi";


export const SubscriptionCard = ({
  name,
  price,
  interval,
  features,
  isPopular = false,
  isCurrentPlan = false,
  onSelect,
}) => {
  return (
    <div
      className={`relative flex flex-col rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isPopular
        ? "border-primary shadow-md ring-2 ring-primary/20"
        : "border-border"
        }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold tracking-wide uppercase text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="pb-2 pt-8 px-6 text-center">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            ${price}
          </span>
          <span className="text-sm text-muted-foreground">/{interval}</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 pt-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-6 pt-4 pb-8">
        <button
          onClick={onSelect}
          className={`w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${isPopular
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
        >
          {isCurrentPlan ? "Current Plan" : "Get Started"}
        </button>
      </div>
    </div>
  );
};


