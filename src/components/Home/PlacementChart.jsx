import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const COLORS = ['#005ff9ff', '#006910ff', '#f90101ff', '#f99901ff', '#fffb00ff', '#fd007fff'];

export default function PlacementChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const placedSet = new Set();
                const stats = {}; // { CSE: { placed: 0, total: 0 } }

                // 1. Fetch ALL students to get department totals
                const fetchAllStudents = async () => {
                    const q = query(collection(db, 'users'), where('role', 'in', ['student', 'coordinator']));
                    const snap = await getDocs(q);
                    
                    snap.forEach(doc => {
                        const student = doc.data();
                        const dept = student.department || 'OTHER';
                        if (!stats[dept]) stats[dept] = { placed: 0, total: 0 };
                        stats[dept].total += 1;

                        // Check if placed
                        if (student.placementStatus === 'Placed' || student.status === 'placed' || student.placed) {
                            if (!placedSet.has(student.email)) {
                                placedSet.add(student.email);
                                stats[dept].placed += 1;
                            }
                        }
                    });
                };

                // 2. Fetch from explicit placedStudents collection for safety
                const fetchFromPlacedStudents = async () => {
                    const snap = await getDocs(collection(db, 'placedStudents'));
                    snap.forEach(doc => {
                        const student = doc.data();
                        if (!placedSet.has(student.email)) {
                            placedSet.add(student.email);
                            const dept = student.department || 'OTHER';
                            if (!stats[dept]) stats[dept] = { placed: 0, total: 0 };
                            stats[dept].placed += 1;
                            // Note: if they are in placedStudents but not users, we increment total too to keep it sane
                            if (stats[dept].total < stats[dept].placed) stats[dept].total = stats[dept].placed;
                        }
                    });
                };

                await Promise.allSettled([fetchAllStudents(), fetchFromPlacedStudents()]);
                
                // Final calculation
                if (Object.keys(stats).length === 0) {
                    // Fallback to sample data with realistic success rates
                    setData([
                        { name: 'CSE', placed: 3, total: 60, value: 3 },
                        { name: 'ECE', placed: 1, total: 55, value: 1 },
                        { name: 'IT', placed: 2, total: 60, value: 2 },
                        { name: 'ME', placed: 2, total: 65, value: 2 },
                        { name: 'EEE', placed: 0, total: 50, value: 0 },
                    ]);
                } else {
                    const processedData = Object.keys(stats).map(dept => ({
                        name: dept,
                        placed: stats[dept].placed,
                        total: stats[dept].total || 1, // Avoid div by zero
                        value: stats[dept].placed // Value for pie chart slice size
                    })).sort((a,b) => b.placed - a.placed);
                    setData(processedData);
                }
            } catch (error) {
                console.error("Error fetching placements from DB:", error);
                setData([
                    { name: 'CSE', placed: 3, total: 60, value: 3 },
                    { name: 'ECE', placed: 1, total: 55, value: 1 },
                    { name: 'IT', placed: 2, total: 60, value: 2 },
                    { name: 'ME', placed: 2, total: 65, value: 2 },
                    { name: 'EEE', placed: 0, total: 50, value: 0 },
                ]);
            }
            setLoading(false);
        };

        fetchPlacements();
    }, []);

    if (loading) return (
        <section className="py-16 bg-gray-50 flex justify-center h-96 items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent shadow-md"></div>
        </section>
    );

    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Placement Distribution</h2>

                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    {/* Top gradient border accent */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>

                    <div className="flex flex-col md:flex-row items-center justify-around gap-12 mt-4">

                        {/* Full-Donut Gauge Chart */}
                        <div className="w-full md:w-1/2 h-64 sm:h-72 relative flex flex-col items-center justify-center group">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={window.innerWidth < 640 ? 70 : 100}
                                        outerRadius={window.innerWidth < 640 ? 100 : 140}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                        animationEasing="ease-out"
                                        cornerRadius={4}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                className="transition-all duration-300 hover:opacity-80 cursor-pointer outline-none"
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onMouseLeave={() => setActiveIndex(-1)}
                                                onTouchStart={() => setActiveIndex(index)}
                                                onTouchEnd={() => setActiveIndex(-1)}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transform transition-all duration-300 group-hover:scale-105">
                                {activeIndex === -1 ? (
                                    <>
                                        <span className="text-6xl font-black text-gray-800 tracking-tight leading-none mb-2">{total}</span>
                                        <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded-md shadow-sm">Total Placed</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-6xl font-black tracking-tight leading-none mb-2" style={{ color: COLORS[activeIndex % COLORS.length] }}>
                                            {((data[activeIndex].placed / Math.max(total, 1)) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-xs font-bold text-gray-600 tracking-widest uppercase mb-1">{data[activeIndex].name}</span>
                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200 shadow-sm">
                                            {data[activeIndex].placed} / {total} TOTAL PLACED
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Interactive Legend List */}
                        <div className="w-full md:w-1/3 max-w-sm">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Department Stats</h3>
                            <div className="space-y-3">
                                {data.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between p-3 py-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-default border border-transparent hover:border-gray-100"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="font-bold text-gray-700">{item.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className="text-gray-600 font-bold leading-none">{item.placed}</div>
                                                <div className="text-[10px] text-gray-400 font-semibold uppercase">Students</div>
                                            </div>
                                            <span className="text-sm font-bold text-blue-600 w-12 text-right">{((item.placed / Math.max(total, 1)) * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
