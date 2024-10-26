import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ExpandableCard from "layout/FaceDemoLayout/Sidebar/MenuCard";
import Slider from "react-slick";

// Icons for the menu cards
import DetectionIcon from "./Icons/DetectionIcon";
import LivenessIcon from "./Icons/LivenessIcon";
import ComparisonIcon from "./Icons/ComparisonIcon";
import SearchIcon from "./Icons/SearchIcon";

const MenuList = () => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();
    const links = ['comparison', 'liveness', 'search', 'detection'];

    const iconComponents = [
        ComparisonIcon,
        LivenessIcon,
        SearchIcon,
        DetectionIcon
    ];

    const handleCardClick = (index) => {
        // Only toggle expansion without navigating to another page for small screens
        if (isSmallScreen) {
            navigate(links[index]);
        } else {
            setExpandedCard(expandedCard === index ? null : index);
            navigate(links[index]);
        }
    };

    // Update screen size state when window is resized
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Slider settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 0, // Set speed to 0 for no animation
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        // // Disable draggable to prevent sliding
        // draggable: false,
        // swipe: false,
    };

    return (
        <div className="menu-list" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {isSmallScreen ? (
                // Render slider for small screens
                <Slider {...sliderSettings}>
                    {['Face Comparison', 'Liveness Detection', 'Face Search', 'Face Detection'].map((label, index) => (
                        <div key={index}>
                            <ExpandableCard
                                label={label}
                                IconComponent={iconComponents[index]}
                                expanded="false" // Manage expansion based on state
                                onClick={() => handleCardClick(index)}
                            />
                        </div>
                    ))}
                </Slider>
            ) : (
                // Render grid layout for larger screens
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {['Face Comparison', 'Liveness Detection', 'Face Search', 'Face Detection'].map((label, index) => (
                        <ExpandableCard
                            key={index}
                            label={label}
                            IconComponent={iconComponents[index]}
                            expanded={expandedCard === index}
                            onClick={() => handleCardClick(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuList;
