import React, { useEffect, useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import MuiTypography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import AnimateButton from 'ui-component/extended/AnimateButton';
import LogoSection from "layout/MainLayout/LogoSection";

const nav__links = [
    {
        path: "/",
        display: "Home",
    },
    {
        path: "/aboutus",
        display: "About Us",
    },
];

const Header = () => {
    const navigate = useNavigate();
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY >= 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            style={{
                position: isSticky ? "fixed" : "relative",
                top: 0,
                width: "100%",
                zIndex: 1000,
                backgroundColor: isSticky ? "#fff" : "transparent",
                boxShadow: isSticky ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                transition: "background-color 0.3s, box-shadow 0.3s"
            }}
        >
            <Grid 
                container 
                rowSpacing={1} 
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                justifyContent="space-evenly"
                alignItems="center"
                sx={{ padding: '10px 0' }}
            >
                {/* Logo */}
                <Grid item xs={4}>
                    <LogoSection />
                </Grid>
                
                {/* Navigation Links and Button */}
                <Grid 
                    item 
                    xs={5} 
                    container 
                    rowSpacing={1} 
                    alignContent="center"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {nav__links.map((item, index) => (
                        <MuiTypography variant="h4" gutterBottom
                            key={index}
                            onClick={() => navigate(item.path)}
                            sx={{ cursor: "pointer", padding: "0 0px" }}
                        >
                            {item.display}
                        </MuiTypography>
                    ))}

                    <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button
                                disableElevation
                                fullWidth
                                size="large"
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/pages/login/verify-email')}
                                sx={{
                                    transition: 'transform 0.2s',
                                    '&:active': { transform: 'scale(0.95)' }
                                }}
                            >
                                Login
                            </Button>
                        </AnimateButton>
                    </Box>
                </Grid>
            </Grid>
        </header>
    );
};
export default Header;
