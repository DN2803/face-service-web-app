import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import SelectForm from '../select-project-forms';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { useCallAPI } from 'hooks/useCallAPI';
import { BACKEND_ENDPOINTS } from 'services/constant';
import { setApiKey } from 'store/actions/authActions';
import { setProject } from 'store/actions/projectActions';
// assets

// ===============================|| AUTH3 - SELECTPROJECT ||=============================== //

const SelectProject = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { callAPI } = useCallAPI();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = async () => {
    const projectName = window.prompt('Please enter the project name:');
    try {
      if (projectName) {
        alert(`Project name entered: ${projectName}`);
        // Bạn có thể xử lý thêm ở đây, ví dụ: lưu tên dự án hoặc điều hướng sang trang khác
        const response = await callAPI(BACKEND_ENDPOINTS.user.project.info, "POST", {project_name: projectName}, true);
            const data = response.data.info;
            console.log(response)
            const project =  {
              name: data.project_name, // Mapping logic
              api: data.key,
              exp: data.expires_at,
              role: data.admin_key_id? "dev":"admin"
            }
            dispatch(setProject(project));
            dispatch(setApiKey(project.api));
            navigate('/dashboard/default');
      } 
    } catch (error) {
      console.error("Error:", error); // Xử lý lỗi nếu có
    }
  };

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Select Project
                          </Typography>
                          <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <SelectForm />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{ textDecoration: 'none', cursor: 'pointer' }}
                        onClick={handleClick}
                      >
                        Create New Project ?
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default SelectProject;
