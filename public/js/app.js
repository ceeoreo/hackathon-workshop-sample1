// The Auth0 client, initialized in configureClient()
// import { createAuth0Client } from '@auth0/auth0-spa-js';

let auth0Client = null;

/**
 * Starts the authentication flow
 */
// before modifying, argument was targetUrl

/*
CF Comment: modified this to only include what's in the quick start
that's why lines 22 - 39 are commented out
*/
const login = async () => {
  await auth0Client.loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });

  // try {
    
  //   console.log("Logging in", targetUrl);

  //   const options = {
  //     authorizationParams: {
  //       redirect_uri: window.location.origin
  //     }
  //   };

  //   if (targetUrl) {
  //     options.appState = { targetUrl };
  //   }

  //   await auth0Client.loginWithRedirect(options);
  // } catch (err) {
  //   console.log("Log in failed", err);
  // }
};

/**
 * Executes the logout flow
 */

/*
CF Comment: modified this to only include what's in the quick start
that's why lines 56 - 65 are commented out
*/
const logout = async () => {
  auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  });
  // try {
  //   console.log("Logging out");
  //   await auth0Client.logout({
  //     logoutParams: {
  //       returnTo: window.location.origin
  //     }
  //   });
  // } catch (err) {
  //   console.log("Log out failed", err);
  // }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config.json");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId
  });
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

// Will run when page finishes loading
// CF Comment: lines 88 - 105 are the same in both the sample project and the quick start walkthrough
window.onload = async () => {
  await configureClient();

  updateUI();
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    return
  }

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    
    updateUI();

    window.history.replaceState({}, document.title, "/");
  }


  ///I commented the lines below out because I was tryiung to figure out if this was the code that casued the issues

  // // If unable to parse the history hash, default to the root URL
  // if (!showContentFromUrl(window.location.pathname)) {
  //   showContentFromUrl("/");
  //   window.history.replaceState({ url: "/" }, {}, "/");
  // }

  // const bodyElement = document.getElementsByTagName("body")[0];

  // // Listen out for clicks on any hyperlink that navigates to a #/ URL
  // bodyElement.addEventListener("click", (e) => {
  //   if (isRouteLink(e.target)) {
  //     const url = e.target.getAttribute("href");

  //     if (showContentFromUrl(url)) {
  //       e.preventDefault();
  //       window.history.pushState({ url }, {}, url);
  //     }
  //   }
  // });

  // const isAuthenticated = await auth0Client.isAuthenticated();

  // //MEEE
  // // const updateUI = async () => {
  // //   document.getElementById("qsLoginBtn").disabled = !isAuthenticated;
  // //   document.getElementById("qsLogoutBtn").disabled = !isAuthenticated;
  // // }


  // if (isAuthenticated) {
  //   console.log("> User is authenticated");
  //   window.history.replaceState({}, document.title, window.location.pathname);
  //   updateUI();
  //   return;
  // }

  // console.log("> User not authenticated");

  // const query = window.location.search;
  // const shouldParseResult = query.includes("code=") && query.includes("state=");

  // if (shouldParseResult) {
  //   console.log("> Parsing redirect");
  //   try {
  //     const result = await auth0Client.handleRedirectCallback();

  //     if (result.appState && result.appState.targetUrl) {
  //       showContentFromUrl(result.appState.targetUrl);
  //     }

  //     console.log("Logged in!");
  //   } catch (err) {
  //     console.log("Error parsing redirect:", err);
  //   }

  //   window.history.replaceState({}, document.title, "/");
  // }

  // updateUI();
};

/*
CF Comment: This was added from the tutorial and wasn't original part of the sample code
*/
const updateUI = async () => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  document.getElementById("qsLoginBtn").disabled = !isAuthenticated;
  document.getElementById("qsLogoutBtn").disabled = !isAuthenticated;

  if (isAuthenticated) {
    document.getElementById("gated-content").classList.remove("hidden");

    document.getElementById(
      "ipt-access-token"
    ).innerHTML = await auth0Client.getTokenSilently();

    document.getElementById("ipt-user-profile").textContent = JSON.stringify(
      await auth0Client.getUser()
    );

  } else {
    document.getElementById("gated-content").classList.add("hidden");
  }
};