import { Grid } from '@mui/material';

import MenuList from './MenuList';

const SilderBar = () => {
    return (
        <>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                // style={{ minHeight: '100vh' }} // Optional: to vertically center if the container takes full height
            >

                <MenuList />

            </Grid>


        </>
    )
}
export default SilderBar