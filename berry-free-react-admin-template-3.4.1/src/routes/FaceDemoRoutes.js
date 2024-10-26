import FaceDemoLayout from 'layout/FaceDemoLayout';
import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';



// Lazy load các component
const FaceDetectionPage = Loadable(lazy(() => import('views/main-functions/face/detection')))
const FaceComparisonPage = Loadable(lazy(() => import('views/main-functions/face/comparison')))
const FaceLivenessPage = Loadable(lazy(() => import('views/main-functions/face/liveness')))
const FaceSearchPage = Loadable(lazy(() => import('views/main-functions/face/search')))
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const FaceDemoRoutes = {
    path: 'face-demo', 
    element: <FaceDemoLayout />,
    children: [
      {
        path: 'detection', 
        element: (
          
          <FaceDetectionPage/>
        )
      },
      {
        path: 'comparison', 
        element: (
          <FaceComparisonPage/>
        )
      },
      {
        path: 'liveness', 
        element: (
          <FaceLivenessPage/>
        )
      },
      {
        path: 'search', 
        element: (
          <FaceSearchPage/>
        )
      }
    ]
}

export default FaceDemoRoutes