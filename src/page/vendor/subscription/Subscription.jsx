
import { useEffect, useState } from 'react';
import { Sparkles, Zap, Crown, Check, X, TrendingUp, Package, Users, BarChart3, Shield, Rocket, Loader } from 'lucide-react';
import CheckoutPage from '../../../libs/CheckoutPage';
// import { useNavigate } from 'react-router-dom';
// import { base } from '../../../redux/services/api';
import { useCreateCheckoutSubscriptionMutation } from '../../../redux/services/externalApi';
import { useAddonCreditsCheckoutMutation, useGetAddonCreditsQuery, useGetSubscriptionDetailQuery, useLazyGetSubscriptionDetailQuery, useSelectVendorSubscriptionMutation } from '../../../redux/services/vendorApi';
import {
    CheckCircle,
    Calendar,
    Coins,
    ArrowRight,
} from "lucide-react";

const VendorSubscriptionPage = () => {
    const [currentPlan, setCurrentPlan] = useState('free');
    const [countryOption, setCountryOption] = useState('global')
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [checkoutPage, { isLoading: isLoadingCheckout, isErrorCheckout }] = useCreateCheckoutSubscriptionMutation()
    const [selectVendorPlan, { isLoading: selectPlanLoading }] = useSelectVendorSubscriptionMutation()

    async function createCheckout() {
        try {
            const formdata = new URLSearchParams();

            formdata.append('intent_id', intentId)

            const result = await checkoutPage(formdata)
            // console.log("res", result)
            debugger;
            if (result?.data?.checkout_url) {
                window.location.href = result?.data?.checkout_url;
                return;
            }
        } catch (err) {
            // console.log("ere", err);
            toast.error(err?.message ?? "Internal Server Error")
        }
    }

    const [
        getSubscriptionDetail,
        { data, isLoading, isError, error }
    ] = useLazyGetSubscriptionDetailQuery();

    useEffect(() => {
        getSubscriptionDetail(countryOption)
    }, [countryOption])

    // console.log("ddlj", data)

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [intentId, setIntentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadhandle, setLoadHandle] = useState(null);

    const handleSubscribe = async (plan) => {
        // console.log("ppp", plan);
        setLoadHandle(plan?.id)
        const formdata = new FormData();
        formdata.append('plan_id', plan?.id);
        formdata.append('country', countryOption)
        try {
            const result = await selectVendorPlan(formdata);
            if (result?.data) {
                setSelectedPlan(plan);
                setIntentId(result?.data?.intent_id || null);
                setIsModalOpen(true);
            }
            if (result?.error) {
                return toast.error(result?.error?.data?.detail ?? "Somthing went  wrong")
            }
            // console.log("rs", result);
        } catch (err) {
            toast.error(err ?? "Internal Server Error");
        } finally {
            setLoadHandle(false);
        }
    };

    const handleConfirm = (plan) => {
        // console.log("Confirmed subscription for:", plan.name);
        createCheckout()
    };


    const [isAddonOpen, setIsAddonOpen] = useState(false)
    const handleAddonPurchase = (e) => {
        e.stopPropagation()
        // console.log("Purchase addon:", item)
        // call your purchase API here
        setIsAddonOpen(false)
    }

    if (isLoading) {
        return <PageLoader />
    }

    return (
        <div className=" bg-linear-to-br ">
            <style>{` 
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

            {/* Header */}
            <div className="w-full mx-auto mb-8 relative z-10">
                <div className=" mb-8 flex justify-end gap-4">

                    <div className="flex flex-col gap-1">

                        <select
                            name="country"
                            value={countryOption}
                            onChange={(e) => setCountryOption(e.target.value)}
                            id="country"
                            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 
               shadow-sm outline-none transition
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                            {data?.dropdown_options?.length > 0 &&
                                data?.dropdown_options?.map((item) => {
                                    return <option value={item}>{item}</option>
                                })
                            }
                        </select>
                    </div>

                    <button
                        onClick={() => setIsAddonOpen(true)}
                        className="h-12x px-5 w-36   rounded-md bg-indigo-600 text-white shadow-md cursor-pointer text-sm hover:bg-[#6390d8] transition"
                    >
                        Add-Credits
                    </button>
                </div>


                {/* Subscription Plans */}
                <div className="grid md:grid-cols-3 gap-8  mx-auto">
                    {data?.plans.map((plan, idx) => {
                        return (
                            <div
                                key={plan.id}
                                className="group relative border border-gray-300 rounded-2xl p-6 bg-white
             transition-all duration-300
             hover:shadow-xl hover:-translate-y-2
            //  hover:border-[#286a94]"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold capitalize text-indigo-600 ">
                                        {plan.name}
                                    </h3>
                                    <Zap
                                        size={22}
                                        className=" text-indigo-600 opacity-60 group-hover:opacity-100"
                                    />
                                </div>

                                {/* Duration */}
                                <p className="mt-3 flex items-center gap-2 text-gray-500">
                                    <Calendar size={18} className="text-indigo-500" />
                                    {plan.duration_days} Days Access
                                </p>

                                {/* Price */}
                                <div className="my-4 flex items-end gap-1">
                                    <span className="text-2xl font-bold text-indigo-600 ">
                                        {plan.currency} {plan.price}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 text-gray-600 mt-4">
                                    <li className="flex items-center gap-2">
                                        <Coins size={18} className="text-yellow-500" />
                                        {plan.credits} Credits
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-500" />
                                        Full Features
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-500" />
                                        Priority Support
                                    </li>
                                </ul>

                                {/* CTA */}
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loadhandle === plan.id}
                                    className={`mt-6 cursor-pointer w-full flex items-center justify-center gap-2
      text-white py-2.5 rounded-lg font-medium
    transition-all duration-300
    
    active:scale-95
    ${loadhandle === plan.id ? "opacity-70 cursor-not-allowed" : ""}
    ${plan?.is_active ? 'opacity-70 bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'hover:bg-indigo-700 bg-indigo-600 hover:shadow-md'}
  `}
                                >
                                    {
                                        plan?.is_active ? (<>
                                            Current Plan
                                        </>) : (<>
                                            {loadhandle === plan.id ? (
                                                "Loading..."
                                            ) : (
                                                <>
                                                    Subscribe Now
                                                    <ArrowRight
                                                        size={18}
                                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                                    />
                                                </>
                                            )}
                                        </>)
                                    }

                                </button>

                            </div>
                        )

                    })}
                </div>

            </div>

            {/* Modal */}
            {selectedPlan && (
                <Modal
                    isLoadingCheckout={isLoadingCheckout}
                    plan={selectedPlan}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirm}
                />
            )}

            {isAddonOpen &&
                <AddonCreditsModal
                    isOpen={isAddonOpen}
                    onClose={() => setIsAddonOpen(false)}
                    onPurchase={handleAddonPurchase}
                />
            }

        </div>
    );
};

export default VendorSubscriptionPage;



import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import PageLoader from '../../../libs/PageLoader';

export const Modal = ({ plan, isLoadingCheckout, isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
                        initial={{ scale: 0.8, opacity: 0, y: -50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-7 cursor-pointer right-4 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>

                        {/* Modal Header */}
                        <h2 className=" text-indigo-600 font-bold text-xl mb-2">
                            Confirm Subscription
                        </h2>
                        <hr className='text-[#d6dbdd] mb-4' />

                        <p className="text-gray-600 mb-4">
                            You're about to subscribe to the{" "}
                            <span className="font-semibold text-indigo-900">{plan.name}</span>{" "}
                            plan.
                        </p>

                        {/* Plan Details */}
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                Duration: {plan.duration_days} days
                            </li>
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                Credits: {plan.credits}
                            </li>
                            <li className="flex items-center gap-2 text-gray-700">
                                <CheckCircle size={18} className="text-green-500" />
                                Price: {plan.currency} {plan.price}
                            </li>
                        </ul>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg cursor-pointer border border-gray-300 text-indigo-400 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <motion.button
                                onClick={() => onConfirm(plan)}
                                className="px-4 py-2 cursor-pointer rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isLoadingCheckout ? <> Loading <span><Loader /></span> </> : <> Confirm <span> <CheckCircle size={18} /></span>  </>}

                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

import { Tag } from "lucide-react"

// function AddonCreditsModal({ isOpen, onClose, onPurchase }) {

//     const { data, isLoading, isError } = useGetAddonCreditsQuery(undefined, {
//         skip: !isOpen, // only fetch when modal is open
//     })
//         if (!isOpen) return null



//     const addons = data?.data || []

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//             <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">

//                 {/* Close */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//                 >
//                     <X size={20} />
//                 </button>

//                 {/* Title */}
//                 <h2 className="text-xl font-bold text-[#286a94] mb-1">Add Credits</h2>
//                 <p className="text-sm text-gray-500 mb-6">
//                     Purchase additional credits for your active plan
//                 </p>

//                 {/* Loading */}
//                 {isLoading && (
//                     <div className="flex justify-center py-10">
//                         <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#286a94] border-t-transparent" />
//                     </div>
//                 )}

//                 {/* Error */}
//                 {isError && (
//                     <p className="text-center text-red-500 py-6">
//                         Failed to load addon credits. Please try again.
//                     </p>
//                 )}

//                 {/* Addon Cards */}
//                 {!isLoading && !isError && addons.map((item) => (
//                     <div
//                         key={item.subscription_id}
//                         className="rounded-xl border border-gray-200 p-5 space-y-4 mb-4"
//                     >
//                         {/* Plan Name */}
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-xs text-gray-400 uppercase tracking-wide">Plan</p>
//                                 <p className="text-base font-semibold capitalize text-gray-800">
//                                     {item.plan_name}
//                                 </p>
//                             </div>
//                             <span className="text-xs bg-blue-50 text-[#286a94] border border-blue-100 px-2 py-1 rounded-full">
//                                 {item.country}
//                             </span>
//                         </div>

//                         {/* Credits Info */}
//                         <div className="grid grid-cols-2 gap-3">
//                             <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-3">
//                                 <p className="text-xs text-gray-400 mb-1">Remaining Credits</p>
//                                 <div className="flex items-center gap-1.5">
//                                     <Coins size={16} className="text-yellow-500" />
//                                     <span className="font-bold text-gray-800">{item.remaining_credits}</span>
//                                 </div>
//                             </div>
//                             <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
//                                 <p className="text-xs text-gray-400 mb-1">Addon Credits</p>
//                                 <div className="flex items-center gap-1.5">
//                                     <Zap size={16} className="text-[#286a94]" />
//                                     <span className="font-bold text-gray-800">+{item.addon.credits}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Pricing */}
//                         <div className="rounded-lg bg-green-50 border border-green-100 p-4 space-y-2">
//                             <div className="flex justify-between text-sm">
//                                 <span className="text-gray-500">Original Price</span>
//                                 <span className="line-through text-gray-400">
//                                     {item.addon.currency} {item.addon.original_price.toFixed(2)}
//                                 </span>
//                             </div>
//                             <div className="flex justify-between text-sm">
//                                 <span className="flex items-center gap-1 text-green-600">
//                                     <Tag size={14} />
//                                     Discount
//                                 </span>
//                                 <span className="text-green-600 font-semibold">
//                                     -{item.addon.discount_percent}%
//                                 </span>
//                             </div>
//                             <hr className="border-green-200" />
//                             <div className="flex justify-between text-base font-bold">
//                                 <span className="text-gray-800">Final Price</span>
//                                 <span className="text-[#286a94]">
//                                     {item.addon.currency} {item.addon.final_price.toFixed(2)}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Purchase Button */}
//                         <button
//                             onClick={() => onPurchase(item)}
//                             className="w-full bg-[#286a94] hover:bg-[#1f5478] text-white py-2.5 rounded-lg font-medium transition-all active:scale-95"
//                         >
//                             Purchase for {item.addon.currency} {item.addon.final_price.toFixed(2)}
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }


// export default Modal;


function AddonCreditsModal({ isOpen, onClose, onPurchase }) {

    const { data, isLoading, isError, error } = useGetAddonCreditsQuery(undefined, {
        skip: !isOpen,
    })

    const [createAddonCheckout, { isLoading: isPurchasing }] = useAddonCreditsCheckoutMutation()
    const [purchasingId, setPurchasingId] = useState(null)

    if (!isOpen) return null

    const addons = data?.data || []

    const handlePurchase = async (item) => {
        try {
            setPurchasingId(item.subscription_id)

            const formdata = new FormData()
            formdata.append("subscription_id", item.subscription_id)

            const result = await createAddonCheckout(formdata)

            if (result?.data?.checkout_url) {
                window.location.href = result.data.checkout_url
                return
            }

            if (result?.error) {
                toast.error(result.error?.data?.detail ?? "Something went wrong")
            }

        } catch (err) {
            toast.error(err?.message ?? "Internal Server Error")
        } finally {
            setPurchasingId(null)
        }
    }

    // console.log("errorro",error);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
                <button
                    onClick={onClose}
                    className="absolute top-8 cursor-pointer right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold text-indigo-600 mb-1">Add Credits</h2>
                <p className="text-sm text-gray-500 border-b pb-3 border-gray-100 mb-6">
                    Purchase additional credits for your active plan
                </p>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#286a94] border-t-transparent" />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <p className="text-center text-sm text-red-500 py-6">
                        {error?.data?.detail ?? "Failed to load addon credits. Please try again."}
                    </p>
                )}

                <div className=' overflow-y-scroll max-h-96'>
                    {/* Addon Cards */}
                    {!isLoading && !isError && addons.map((item) => (
                        <div
                            key={item.subscription_id}
                            className="rounded-xl border border-gray-200 p-5 space-y-4 mb-4"
                        >
                            {/* Plan Name */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Plan</p>
                                    <p className="text-base font-semibold capitalize text-gray-800">
                                        {item.plan_name}
                                    </p>
                                </div>
                                <span className="text-xs bg-blue-50 text-[#286a94] border border-blue-100 px-2 py-1 rounded-full">
                                    {item.country}
                                </span>
                            </div>

                            {/* Credits Info */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-3">
                                    <p className="text-xs text-gray-400 mb-1">Remaining Credits</p>
                                    <div className="flex items-center gap-1.5">
                                        <Coins size={16} className="text-yellow-500" />
                                        <span className="font-bold text-gray-800">{item.remaining_credits}</span>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                                    <p className="text-xs text-gray-400 mb-1">Addon Credits</p>
                                    <div className="flex items-center gap-1.5">
                                        <Zap size={16} className="text-[#286a94]" />
                                        <span className="font-bold text-gray-800">+{item.addon.credits}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="rounded-lg bg-green-50 border border-green-100 p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Original Price</span>
                                    <span className="line-through text-gray-400">
                                        {item.addon.currency} {item.addon.original_price.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-1 text-green-600">
                                        <Tag size={14} />
                                        Discount
                                    </span>
                                    <span className="text-green-600 font-semibold">
                                        -{item.addon.discount_percent}%
                                    </span>
                                </div>
                                <hr className="border-green-200" />
                                <div className="flex justify-between text-base font-bold">
                                    <span className="text-gray-800">Final Price</span>
                                    <span className="text-[#286a94]">
                                        {item.addon.currency} {item.addon.final_price.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Purchase Button */}
                            <button
                                onClick={() => handlePurchase(item)}
                                disabled={purchasingId === item.subscription_id}
                                className={`w-full flex items-center cursor-pointer justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium transition-all active:scale-95
                ${purchasingId === item.subscription_id ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-500"}
              `}
                            >
                                {purchasingId === item.subscription_id ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Redirecting...
                                    </>
                                ) : (
                                    <>
                                        Pay {item.addon.currency} {item.addon.final_price.toFixed(2)}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}


// You are given an integer array nums. The range of a subarray of nums is the
//  difference between the largest and smallest element in the subarray.

// Return the sum of all subarray ranges of nums.

// A subarray is a contiguous non-empty sequence of elements within an array.
