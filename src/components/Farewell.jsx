import React from 'react';
import { motion } from 'framer-motion';
import pic1 from '../assets/farewell_1.jpg';
import pic2 from '../assets/farewell_2.jpg';
import pic3 from '../assets/farewell_3.jpg';
import pic4 from '../assets/farewell_4.jpg';

const Farewell = () => {
    const images = [pic1, pic2, pic3, pic4];

    return (
        <section className="bg-slate-50 py-32 border-b border-slate-200">
            <div className="container-wide">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Special Event</span>
                    <h2 className="text-4xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tight">
                        Farewell to <br className="hidden md:block" />
                        <span className="text-primary italic font-serif">Mrs Taai</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
                        Last Thursday, we gathered to celebrate the incredible leadership of our beloved Principal, Mrs Eleanor Taai. We thank her for her years of dedicated service, wisdom, and the caring environment she fostered at Alexandria High School.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl shadow-lg border border-slate-200 group relative"
                        >
                            <img
                                src={img}
                                alt={`Farewell ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Farewell;
