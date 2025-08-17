import React from 'react';
import colors from "../../constants/colors.js";
import { useNavigate } from 'react-router-dom';

const ViewEventHeader = () => {
    const naviagte = useNavigate();
    return (
        <div className="p-4">
            <h1 className="text-xl lg:text-3xl text-center font-bold" style={{ color: colors.primary }}>View Events</h1>
            <p className='text-center mb-4 text-gray-500 text-sm'>
                Populate your event list by adding exciting new happenings. Share what’s coming up!
            </p>
            <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row items-center lg:justify-between space-x-4">
                {/* Search input on left */}
                <input
                    type="search"
                    placeholder="Search events..."
                    className={`flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:border-transparent transition  text-sm lg:text-md`}
                    onFocus={e => e.target.style.borderColor = colors.secondary}
                    onBlur={e => e.target.style.borderColor = ''}
                />

                {/* Create Event button on right */}
                <button
                    onClick={() => naviagte('/organizers/addEvent')}
                    style={{ backgroundColor: colors.primary }}
                    className="text-white text-sm lg:text-md px-4 py-2 rounded-md hover:bg-[#bfb1f2] transition"
                >
                    Create Event
                </button>

            </div>
        </div>
    );
};

export default ViewEventHeader;
