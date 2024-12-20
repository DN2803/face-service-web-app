
export const BACKEND_ENDPOINTS = {
    auth: {
      register: {
        checkMail: "/auth/register/check-email",
        submit: "/auth/register/submit"
      }, 
      login: {
        identify: "/auth/login/identify",
        password: "/auth/login/validate/password",
        faceid: "/auth/login/validate/face-id"
      }, 
      refesh_token: "/auth/refresh-token"
    }, 
    user: {
      register: {
        faceid: "/user/register-face-id"
      },
      info: "/user/my-info",
      project: {
        info: "/user/my-project",
        team: "/user/my-project/team"
      }
    },
    demo_function: {
      detection: "/demo/detection",
      comparison: "/demo/comparison",
      liveness: "/demo/anti-spoofing",
      search: "/demo/search"
    }, 
    project: {
      person: "/project/person",
      collection: "/project/collection",
      persons: "/project/persons",
      collections: "/project/collections",
      search: "/project/search",
    }
  };
  