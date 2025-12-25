
const SITE_MAP = {
  home : {
    Home : "/"
  },
  auth : {
    Login : "/auth/login",
    Signup : "/auth/signup",
  },
  problems : {
    Problems : "/problems",
    ProblemDetails : (problemId: string) => `/problems/${problemId}`,
  }
}

export default SITE_MAP;