import { useState, useEffect } from "react";
import {
    useAddPlanByAdminMutation,
    useDeleteSubscriptionMutation,
    useGetFilteredSubscriptionQuery,
    useUpdatePlanByAdminMutation,
    useLazyGetAllOptionPlanQuery,
    useSetAddonPriceMutation
} from "../redux/services/adminApi";
import { Edit, SquarePen, Trash2, Search, Globe, CreditCard, Clock, DollarSign, TrendingUp, Plus, Settings, X, Infinity } from "lucide-react";
import { useGetCountryCurrencyMutation, useGetCountryDataQuery } from "../redux/services/externalApi";
import Select from 'react-select'
import toast from "react-hot-toast";
import useDebounce from "../libs/useDebounce";
import PageLoader from "../libs/PageLoader";
import { T } from "../components/admin/superadmin/SuperAdminDashboard";


export default function SubscriptionModule() {
    
    const [pageNumber, setPageNumber] = useState(1)
    const [size, setSize] = useState(10)
    const { data: countryList } = useGetCountryDataQuery();
    const [showPresetModal, setShowPresetModal] = useState(false)
    const [
        triggerGetAllOptionPlan,
        {
            data: planOption
        },
    ] = useLazyGetAllOptionPlanQuery();
    const [setAddonPrice, { isLoading: isLoadingSetOnPrice, isError: isLoadingError }] = useSetAddonPriceMutation()
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState({
        id: null,
        country: ''
    });

    const [search, setSearch] = useState('')
    const [mode, setMode] = useState("add");
    const [currency, setCurrency] = useState("USD")
    const [addPlanCountryWise, { isLoading: addplanLoading }] = useAddPlanByAdminMutation()
    const [updatePlanCountryWise, { isLoading: updateplanLoading }] = useUpdatePlanByAdminMutation()
    const [deletePlan, { isLoading: deletePlanLoading, isError: deltePlanError }] = useDeleteSubscriptionMutation()
    const [getCountryCurrency, { data: getCurrencyData }] = useGetCountryCurrencyMutation();
    const debouncedQuery = useDebounce(search, 500);
    const planOptionbar = planOption?.plans ?? []

    const GLOBAL_OPTION = {
        value: null,
        searchLabel: "",
        label: "Global Country"
    };

    const options = [
        GLOBAL_OPTION,
        ...((countryList?.data || [])?.map((c) => ({
            value: c,
            searchLabel: c.name,
            label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                        src={c.flag ?? "img"}
                        alt={c.name}
                        style={{ width: 20, height: 14, objectFit: "cover" }}
                    />
                    <span>{c.name}</span>
                </div>
            )
        })))
    ];

    const [selectedOption, setSelectedOption] = useState(GLOBAL_OPTION);

    const { data: plans, isLoading, isError } = useGetFilteredSubscriptionQuery({
        country: selectedOption?.value?.name ?? null,
        plan: debouncedQuery, pageNumber, size
    });

    // console.log("opinionnnn",selectedOption);
    useEffect(() => {
        const country = selectedOption?.value;

        if (country) {
            getCountryCurrency(country.iso2);
        } else {
            setCurrency((prev) => (prev === "USD" ? prev : "USD"));
        }
    }, [selectedOption?.value?.iso2]);

    useEffect(() => {
        const newCurrency = getCurrencyData?.data?.currency;

        if (newCurrency) {
            setCurrency((prev) =>
                prev === newCurrency ? prev : newCurrency
            );
        }
    }, [getCurrencyData]);

    const [creditPrice, setCreditPrice] = useState(1);

    const [formData, setFormData] = useState({
        name: "",
        duration_days: "",
        credits: "",
        price: "",
        currency: ""
    });

    const handleOpenAdd = () => {
        setMode("add");
        setFormData({ name: "", duration_days: "", credits: "", price: "" });
        setShowModal(true);
        triggerGetAllOptionPlan()
    };

    const handleOpenEdit = (plan) => {
        // console.log("pplan", plan);
        setMode("edit");
        setFormData({
            ...plan,
            plan_id: plan?.plan_id ? plan?.plan_id : plan?.id
        });
        setShowModal(true);
        triggerGetAllOptionPlan()
    };
    // console.log("fom",formData)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            ...formData,
            currency: currency,
        }
        if (mode !== "edit") {
            data.country = selectedOption?.searchLabel
        }
        if (selectedOption?.value == null) {
            data.country = ""
        }

        try {
            const result = mode === "edit" ? await updatePlanCountryWise(data) : await addPlanCountryWise(data)
            if (result?.data) {
                setTimeout(() => {
                    toast.success(mode === "edit" ? 'Subscription Plan updates successfully' : 'Subscription Plan added successfully')
                    setShowModal(false);
                }, 1000)
            }
            if (result?.error?.data) {
                return toast.error(result?.error?.data?.detail ?? "Something went wrong")
            }
            // console.log("rms", result);
        } catch (err) {
            // console.log("ererer", err)
            toast.error("Something went wrong")
        }
    };

    const openDeletePopup = (p) => {
        setSelectedId({
            id: p?.plan_id ? p?.plan_id : p?.id,
            country: p?.country ?? null
        })
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const data = {};
            if (selectedId?.country) {
                data.country = selectedId?.country
            }
            data.plan_id = selectedId?.id
            // console.log("first-del", data);

            const result = await deletePlan(data);
            if (result?.data) {
                setDeleteModal(false);
                setSelectedId(null);
                toast.success("plan deleted successfully.")
                return;
            }

            if (deltePlanError) {
                setTimeout(() => {
                    toast.error(result?.error?.data?.detail ?? "Error occurred..")
                }, 1000)
                return;
            }
        } catch (err) {
            toast.error("something went wrong")
        }
        // await deleteSubscription(selectedId);

    };

    const handleSetCredit = async () => {
        try {
            if (!creditPrice) {
                toast.error("Please fill Addon Percentage")
                return;
            }
            const formdata = new FormData();
            formdata.append('discount_percent', creditPrice)
            const result = await setAddonPrice(formdata)
            if (result?.data) {
                toast.success("add-on price set successfully..")
                setTimeout(() => {
                    setShowPresetModal(false);
                }, 500)
            }
            // console.log("ress",result)
        } catch (err) {
            // console.log("err in hadleset credit",err)
            toast.error("Error occurred..")
        }
    }

    if (isLoading) return <PageLoader />

    if (isError) return <p className="p-4">Something went wrong</p>

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Header */}
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                flexWrap: "wrap", 
                gap: 12,
                background: "linear-gradient(135deg,rgba(34,197,94,.1),rgba(16,185,129,.05))",
                padding: "20px 24px",
                borderRadius: 16,
                border: `1px solid ${T.border}`
            }}>
                <div>
                    <h1 style={{ 
                        color: T.text, 
                        fontWeight: 800, 
                        fontSize: 22, 
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                    }}>
                        <Settings size={24} style={{ color: T.accent }}/>
                        Subscription Management
                    </h1>
                    <p style={{ color: T.textMuted, fontSize: 13 }}>
                        Add/edit subscription plans and manage addon pricing
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Select
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minHeight: "42px",
                                borderRadius: "10px",
                                border: `1px solid ${T.border}`,
                                background: "rgba(34,197,94,.04)",
                                boxShadow: "none",
                                "&:hover": {
                                    border: `1px solid ${T.border}`
                                }
                            }),
                            option: (provided) => ({
                                ...provided,
                                padding: "10px 12px"
                            })
                        }}
                        className="w-72"
                        showSearch
                        options={options}
                        optionFilterProp="searchLabel"
                        value={selectedOption}
                        onChange={setSelectedOption}
                        isSearchable
                        filterOption={(option, inputValue) =>
                            option.data.searchLabel
                                ?.toLowerCase()
                                .includes(inputValue.toLowerCase())
                        }
                    />
                </div>
            </div>

            {/* Credit Price Box */}
            <div style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "20px 24px",
                boxShadow: "0 4px 16px rgba(0,0,0,.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 12, 
                        background: `${T.gold}15`, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                    }}>
                        <DollarSign size={22} style={{ color: T.gold }}/>
                    </div>
                    <div>
                        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 4 }}>
                            Addon discount – Pay {plans?.addon_discount_percent}% off the price and receive full defined credits
                        </p>
                        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, lineHeight: 1 }}>
                            {plans?.addon_discount_percent ?? '—'}%
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => [setShowPresetModal(true), setCreditPrice(plans?.addon_discount_percent)]}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all .2s",
                        background: "linear-gradient(135deg,rgb(34,197,94),rgb(22,163,74))",
                        border: "none",
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(34,197,94,.25)"
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,.35)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,.25)";
                    }}
                >
                    <Edit size={16} />
                    Edit Discount
                </button>
            </div>

            {/*
                <div className="mt-4">
                    <p className="text-sm font-medium text-[#4c82a8] mb-2">Presets</p>
                    <div className="grid grid-cols-3 gap-3">
                        {customPricesData?.map((p) => (
                            <div key={p.id} className="p-3 border rounded flex items-center justify-between">
                                <div>
                                    <div className="text-sm">₹{p.price}</div>
                                    <div className="text-xs text-gray-500">preset #{p.id}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-2 py-1 border rounded text-sm" >Apply</button>
                                    <button className="px-2 py-1 border rounded text-sm" >Edit</button>
                                    <button className="px-2 py-1 border rounded text-sm text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                        {(!customPricesData || customPricesData.length === 0) && <div className="text-sm text-gray-500 col-span-3">No presets</div>}
                    </div>
                </div>
            </section> */}


            {/* Plans Table */}
            <div style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                boxShadow: "0 8px 32px rgba(0,0,0,.08), 0 0 0 1px rgba(255,255,255,.5) inset",
                overflow: "hidden"
            }}>
                <div style={{ height: 3, background: "linear-gradient(90deg,#22c55e,#16a34a,#10b981)", width: "100%" }}/>
                <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                        <div style={{ position: "relative" }}>
                            <Search size={14} style={{ 
                                position: "absolute", 
                                left: 12, 
                                top: "50%", 
                                transform: "translateY(-50%)", 
                                color: "rgba(100,116,139,.35)", 
                                pointerEvents: "none" 
                            }}/>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by plan name"
                                style={{
                                    background: "rgba(34,197,94,.04)",
                                    border: `1px solid ${T.borderSoft}`,
                                    borderRadius: 10,
                                    padding: "8px 12px 8px 36px",
                                    width: 280,
                                    fontSize: 13,
                                    color: T.text,
                                    outline: "none",
                                    transition: "all .2s"
                                }}
                                onFocus={e => {
                                    e.target.style.border = `1px solid ${T.border}`;
                                    e.target.style.background = "rgba(34,197,94,.08)";
                                }}
                                onBlur={e => {
                                    e.target.style.border = `1px solid ${T.borderSoft}`;
                                    e.target.style.background = "rgba(34,197,94,.04)";
                                }}
                            />
                        </div>
                        <button
                            onClick={handleOpenAdd}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "10px 16px",
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all .2s",
                                background: "linear-gradient(135deg,rgb(34,197,94),rgb(22,163,74))",
                                border: "none",
                                color: "#fff",
                                boxShadow: "0 4px 16px rgba(34,197,94,.25)"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,.35)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,.25)";
                            }}
                        >
                            <Plus size={16} />
                            Add Plan
                        </button>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: `1px solid ${T.borderSoft}`, background: "rgba(255,255,255,.02)" }}>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Plan Name</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Duration</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Credits</th>
                                <th style={{ textAlign: "left", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Price</th>
                                <th style={{ textAlign: "right", padding: "14px 18px", fontSize: 11, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: T.textMuted, fontSize: 13 }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : plans?.plans?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: T.textMuted, fontSize: 13 }}>
                                        No subscription plans found
                                    </td>
                                </tr>
                            ) : (
                                plans?.plans?.map((p, index) => (
                                    <tr
                                        key={p.id}
                                        style={{ borderBottom: `1px solid rgba(255,255,255,.04)`, transition: "background .15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(34,197,94,.03)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <td style={{ padding: "16px 18px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ 
                                                    width: 36, 
                                                    height: 36, 
                                                    borderRadius: 10, 
                                                    background: `${T.accent}15`, 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center" 
                                                }}>
                                                    <CreditCard size={16} style={{ color: T.accent }}/>
                                                </div>
                                                <span style={{ color: T.text, fontWeight: 600, fontSize: 13 }}>
                                                    {p?.name}
                                                </span>
                                            </div>
                                        </td>

                                        <td style={{ padding: "16px 18px", fontSize: 13, color: T.textMuted }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <Clock size={13} style={{ color: T.textDim }}/>
                                                {p?.duration_days} days
                                            </div>
                                        </td>

                                        <td style={{ padding: "16px 18px", fontSize: 13, color: T.textMuted }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <TrendingUp size={13} style={{ color: T.textDim }}/>
                                                {p?.credits || "-"}
                                            </div>
                                        </td>

                                        <td style={{ padding: "16px 18px", fontSize: 13, color: T.textMuted }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <DollarSign size={13} style={{ color: T.gold }}/>
                                                {p?.price} {p?.currency}
                                            </div>
                                        </td>

                                        <td style={{ padding: "16px 18px", textAlign: "right" }}>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, alignItems: "center" }}>
                                                <button
                                                    onClick={() => handleOpenEdit(p)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "6px 12px",
                                                        borderRadius: 8,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        transition: "all .2s",
                                                        background: "rgba(34,197,94,.08)",
                                                        border: `1px solid ${T.accent}30`,
                                                        color: T.accent
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = "rgba(34,197,94,.15)";
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = "rgba(34,197,94,.08)";
                                                    }}
                                                >
                                                    <SquarePen size={14} />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => openDeletePopup(p)}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "6px 12px",
                                                        borderRadius: 8,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        transition: "all .2s",
                                                        background: "rgba(239,68,68,.08)",
                                                        border: `1px solid rgba(239,68,68,.3)`,
                                                        color: "#ef4444"
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = "rgba(239,68,68,.15)";
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = "rgba(239,68,68,.08)";
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            </div>


            {/* Add/Edit Modal */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div style={{ background: T.surface, width: "100%", borderRadius: 18, padding: "24px", border: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <h2 style={{ fontSize: 20, color: T.text, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                                <CreditCard size={20} style={{ color: T.accent }}/>
                                {mode === "add" ? "Add Subscription" : "Edit Subscription"}
                            </h2>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: 6,
                                    borderRadius: 8,
                                    background: "transparent",
                                    border: "none",
                                    color: T.textMuted,
                                    cursor: "pointer",
                                    display: "flex"
                                }}
                            >
                                <X size={18}/>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {/* Plan Name */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6 }}>Plan Name</label>
                                {
                                    selectedOption?.value === null ? (
                                        <input
                                            type="text"
                                            style={{
                                                border: `1px solid ${T.border}`,
                                                padding: "10px 12px",
                                                borderRadius: 10,
                                                outline: "none",
                                                fontSize: 13,
                                                color: T.text,
                                                background: "rgba(34,197,94,.02)"
                                            }}
                                            placeholder="Enter plan name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            required
                                        />
                                    ) : (
                                        <select 
                                            name="name" 
                                            style={{
                                                color: T.text,
                                                width: "100%",
                                                height: "100%",
                                                border: `1px solid ${T.border}`,
                                                padding: "10px 12px",
                                                borderRadius: 10,
                                                outline: "none",
                                                fontSize: 13,
                                                background: "rgba(34,197,94,.02)"
                                            }}
                                            onChange={(e) => {
                                                const selectedPlan = planOptionbar?.find(
                                                    (item) => item.name === e.target.value
                                                );

                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                    duration_days: selectedPlan?.duration_days || "",
                                                    credits: selectedPlan?.credits || ""
                                                });
                                            }
                                            }
                                            value={formData.name}
                                            required
                                        >
                                            <option selected value="" disabled>Select Plan</option>
                                            {
                                                planOptionbar?.map((item) => (
                                                    <option value={item?.name} >{item?.name}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                            </div>

                            {/* Duration */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6 }}>Duration (days)</label>
                                <input
                                    type="number"
                                    style={{
                                        border: `1px solid ${T.border}`,
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        outline: "none",
                                        fontSize: 13,
                                        color: T.text,
                                        background: "rgba(34,197,94,.02)"
                                    }}
                                    placeholder="Days"
                                    value={formData.duration_days}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            duration_days: e.target.value,
                                        });
                                    }}
                                    disabled={selectedOption?.value !== null}
                                    min={1}
                                    required
                                />
                            </div>


                            {/* Select Option */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6 }}>Country</label>
                                <Select
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            minHeight: "42px",
                                            borderRadius: "10px",
                                            border: `1px solid ${T.border}`,
                                            background: "rgba(34,197,94,.02)",
                                            boxShadow: "none"
                                        })
                                    }}
                                    showSearch
                                    options={options}
                                    optionFilterProp="searchLabel"
                                    defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    isSearchable
                                    filterOption={(option, inputValue) =>
                                        option.data.searchLabel
                                            ?.toLowerCase()
                                            .includes(inputValue.toLowerCase())
                                    }
                                />
                            </div>

                            {/* Currency */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6 }}>Currency</label>
                                <input
                                    type="text"
                                    style={{
                                        border: `1px solid ${T.border}`,
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        outline: "none",
                                        fontSize: 13,
                                        color: T.textMuted,
                                        background: "rgba(34,197,94,.02)"
                                    }}
                                    placeholder="Currency"
                                    value={currency}
                                    disabled
                                />
                            </div>

                            {/* Credits */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6 }}>Credits</label>
                                <input
                                    type="number"
                                    style={{
                                        border: `1px solid ${T.border}`,
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        outline: "none",
                                        fontSize: 13,
                                        color: T.text,
                                        background: "rgba(34,197,94,.02)"
                                    }}
                                    placeholder="Credits"
                                    value={formData.credits}
                                    disabled={selectedOption?.value !== null}
                                    onChange={(e) =>
                                        setFormData({ ...formData, credits: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6 }}>Price</label>
                                <input
                                    type="number"
                                    style={{
                                        border: `1px solid ${T.border}`,
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        outline: "none",
                                        fontSize: 13,
                                        color: T.text,
                                        background: "rgba(34,197,94,.02)"
                                    }}
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    required
                                />
                            </div>


                            {/* Buttons — Full Width Row */}
                            <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 10,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all .2s",
                                        background: "rgba(148,163,184,.1)",
                                        border: `1px solid rgba(148,163,184,.2)`,
                                        color: T.textMuted
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "rgba(148,163,184,.2)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgba(148,163,184,.1)";
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 10,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all .2s",
                                        background: "linear-gradient(135deg,rgb(34,197,94),rgb(22,163,74))",
                                        border: "none",
                                        color: "#fff",
                                        boxShadow: "0 4px 16px rgba(34,197,94,.25)"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,.35)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "none";
                                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,.25)";
                                    }}
                                >
                                    {mode === "add" ? (addplanLoading ? "Adding" : "Add") : (updateplanLoading ? 'Updating' : "Update")}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

            )}

            {/* DELETE CONFIRMATION POPUP */}
            {deleteModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: T.surface, padding: "24px", borderRadius: 18, width: "480px", border: `1px solid ${T.border}`, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                            <div style={{ 
                                width: 48, 
                                height: 48, 
                                borderRadius: 12, 
                                background: "rgba(239,68,68,.12)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center" 
                            }}>
                                <Trash2 size={24} style={{ color: "#ef4444" }}/>
                            </div>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>
                                    Confirm Delete
                                </h2>
                                <p style={{ fontSize: 13, color: T.textMuted }}>This action cannot be undone</p>
                            </div>
                        </div>
                        <p style={{ fontSize: 14, color: T.text, marginBottom: 24, lineHeight: 1.5 }}>Are you sure you want to delete this plan?</p>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                            <button
                                onClick={() => [setDeleteModal(false), setSelectedId(null)]}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all .2s",
                                    background: "rgba(148,163,184,.1)",
                                    border: `1px solid rgba(148,163,184,.2)`,
                                    color: T.textMuted
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(148,163,184,.2)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(148,163,184,.1)";
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all .2s",
                                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                                    border: "none",
                                    color: "#fff",
                                    boxShadow: "0 4px 16px rgba(239,68,68,.25)"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(239,68,68,.35)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(239,68,68,.25)";
                                }}
                            >
                                {deletePlanLoading ? 'Deleting..' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPresetModal && (
                <Modal onClose={() => setShowPresetModal(false)}>
                    <div style={{ padding: "24px", background: T.surface, borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,.3)", minWidth: "380px", border: `1px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <h3 style={{ fontSize: 20, color: T.text, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                                <Settings size={20} style={{ color: T.gold }}/>
                                Edit Addon Percentage
                            </h3>
                            <button 
                                onClick={() => setShowPresetModal(false)}
                                style={{
                                    padding: 6,
                                    borderRadius: 8,
                                    background: "transparent",
                                    border: "none",
                                    color: T.textMuted,
                                    cursor: "pointer",
                                    display: "flex"
                                }}
                            >
                                <X size={18}/>
                            </button>
                        </div>

                        <div style={{ width: "100%" }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginTop: 12, marginBottom: 8 }}>
                                Addon Credit Percentage (%)
                            </label>

                            <input
                                type="text"
                                style={{
                                    border: `1px solid ${T.border}`,
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    outline: "none",
                                    fontSize: 13,
                                    color: T.text,
                                    background: "rgba(34,197,94,.02)",
                                    width: "100%"
                                }}
                                value={creditPrice}
                                onChange={(e) => {
                                    const val = e.target.value;

                                    // Allow empty while typing
                                    if (val === "") {
                                        setCreditPrice("");
                                        return;
                                    }

                                    // Allow only digits
                                    if (!/^\d+$/.test(val)) return;

                                    let num = Number(val);

                                    // Clamp between 1 and 99
                                    if (num < 1) num = 1;
                                    if (num > 99) num = 99;

                                    setCreditPrice(num);
                                }}
                                placeholder="Enter percentage"
                            />

                        </div>


                        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
                            <button
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all .2s",
                                    background: "rgba(148,163,184,.1)",
                                    border: `1px solid rgba(148,163,184,.2)`,
                                    color: T.textMuted
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(148,163,184,.2)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(148,163,184,.1)";
                                }}
                                onClick={() => setShowPresetModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all .2s",
                                    background: "linear-gradient(135deg,rgb(34,197,94),rgb(22,163,74))",
                                    border: "none",
                                    color: "#fff",
                                    boxShadow: "0 4px 16px rgba(34,197,94,.25)"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,.35)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,.25)";
                                }}
                                onClick={handleSetCredit}
                            >
                                {isLoadingSetOnPrice ? 'Saving' : 'Save'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    );
}



function Modal({ children, onClose }) {
    const [show, setShow] = useState(false);

    // Trigger opening animation
    useEffect(() => {
        setTimeout(() => setShow(true), 10);
    }, []);

    // Trigger close animation
    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 200); // match animation duration
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                background: "rgba(0,0,0,.4)",
                transition: "opacity 200ms",
                opacity: show ? 1 : 0
            }}
            onClick={handleClose}
        >
            {/* Prevent click from closing when clicking inside */}
            <div
                style={{
                    background: T.surface,
                    borderRadius: 18,
                    boxShadow: "0 20px 60px rgba(0,0,0,.3)",
                    maxWidth: "600px",
                    width: "100%",
                    transition: "all 200ms",
                    transform: show ? "scale(1)" : "scale(0.95)",
                    opacity: show ? 1 : 0,
                    border: `1px solid ${T.border}`
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>)
}


//  <div className="bg-white rounded-lg p-6 w-[400px]">
//                         <h3 className="text-lg font-medium mb-4">
//                             {initial ? "Edit Subscription" : "Add Subscription"}
//                         </h3>

//                         <div className="flex flex-col gap-3">

//                             <input
//                                 placeholder="Plan name"
//                                 className="border border-gray-300 px-2 py-1 rounded"
//                                 value={state.name}
//                                 onChange={(e) => setState({ ...state, name: e.target.value })}
//                             />

//                             <input
//                                 placeholder="Duration days"
//                                 type="number"
//                                 className="border px-2 border-gray-300  py-1 rounded"
//                                 value={state.duration_days}
//                                 onChange={(e) =>
//                                     setState({ ...state, duration_days: e.target.value })
//                                 }
//                             />

//                             {state.type === "credit" && (
//                                 <input
//                                     placeholder="Credits"
//                                     type="number"
//                                     className="border px-2 border-gray-300  py-1 rounded"
//                                     value={state.credits}
//                                     onChange={(e) =>
//                                         setState({ ...state, credits: e.target.value })
//                                     }
//                                 />
//                             )}

//                             <input
//                                 placeholder="Price (₹)"
//                                 type="number"
//                                 className="border px-2 border-gray-300  py-1 rounded"
//                                 value={state.price}
//                                 onChange={(e) => setState({ ...state, price: e.target.value })}
//                             />

//                             {/* Calculated Total (optional for credit plan) */}
//                             {state.type === "credit" && (
//                                 <div className="text-sm text-gray-600">
//                                     Calculated total: ₹
//                                     {(Number(state.credits) * Number(creditPrice || 0)).toFixed(2)}
//                                 </div>
//                             )}
//                         </div>

//                         <div className="mt-4 flex justify-end gap-2">
//                             <button className="px-4 py-2" onClick={onCancel}>
//                                 Cancel
//                             </button>
//                             <button
//                                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                                 onClick={() => onSave({ ...initial, ...state })}
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>