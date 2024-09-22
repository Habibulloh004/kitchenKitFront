import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, lazy, Suspense, useLayoutEffect } from "react";
import { IoReload } from "react-icons/io5";
import Loader from "./components/Loader/Loader";
import Cookies from "js-cookie";
// import Order from "./components/Order";
// import Home from "./components/Home";
// import History from "./components/History";
import Navbar from "./components/Navbar";
const Home = lazy(() => import("./components/Home"));
const Order = lazy(() => import("./components/Order"));
const History = lazy(() => import("./components/History"));
import toast from "react-hot-toast";
// import Spots from "./components/Spots";
// import Workshops from "./components/Workshops";

// const ProtectedRoute = ({ element }) => {
//   const location = useLocation();
//   const [token] = useState(Cookies.get("authToken"));

//   const queryParams = new URLSearchParams(location.search);
//   const haveToken = queryParams.get("token");

//   return token || haveToken
//     ? element
//     : (window.location.href = `https://joinposter.com/api/auth?application_id=3629&redirect_uri=${
//         import.meta.env.VITE_BACKEND
//       }/auth&response_type=code`);
// };

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  const [token] = useState(Cookies.get("authToken"));

  const queryParams = new URLSearchParams(location.search);
  const haveToken = queryParams.get("token");

  useEffect(() => {
    if (!token && !haveToken) {
      window.location.href = `https://joinposter.com/api/auth?application_id=3629&redirect_uri=${
        import.meta.env.VITE_BACKEND
      }/auth&response_type=code`;
    }
  }, [token, haveToken]);

  // If there's a token or a token in query params, render the element
  return token || haveToken ? element : null;
};

function App() {
  const [screenSize, setScreenSize] = useState(600);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const sixMonthsInMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000;
    const savedTime = localStorage.getItem("savedTime");

    if (savedTime) {
      const elapsedTime = currentTime - parseInt(savedTime, 10);
      if (elapsedTime > sixMonthsInMilliseconds) {
        Cookies.remove("authToken");
        localStorage.removeItem("accountSettings");
        localStorage.setItem("savedTime", currentTime.toString());
      }
    } else {
      localStorage.setItem("savedTime", currentTime.toString());
    }
  }, []);

  function resizeHandler() {
    setScreenSize(window.innerWidth);
  }

  useLayoutEffect(() => {
    setScreenSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      {screenSize < 500 ? (
        <>
          <main className="w-9/12 mx-auto h-screen flex justify-center items-center flex-col text-center gap-5">
            <h1 className="text-3xl font-semibold">Hey! 👋</h1>
            <p className="text-secondary-gray text-base">
              This task is designed for a screen width of{" "}
              <span className="text-blue-500">500px or greater</span>. Please
              focus your evaluation and testing on this resolution. The
              assessment of mobile or smaller screen designs is not required at
              this stage, and we encourage you to concentrate on the larger
              screen format.
            </p>
            <p className="text-lg font-semibold">Thank you and good luck! 🍀</p>
          </main>
        </>
      ) : (
        <main className="relative min-h-screen">
          <Toaster position="top-center" reverseOrder={false} />

          <Navbar />
          <div className="pt-[48px]">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route
                  path="/"
                  element={<ProtectedRoute element={<Home />} />}
                />
                <Route
                  path="/:id"
                  element={<ProtectedRoute element={<Order />} />}
                />
                <Route
                  path="/history"
                  element={<ProtectedRoute element={<History />} />}
                />
              </Routes>
            </Suspense>
            <Toaster position="top-center" reverseOrder={false} />
          </div>
          <div
              className="fixed bottom-5 left-5 rounded-full p-2 bg-white/70"
              onClick={() => window.location.reload()}
            >
              <IoReload />
            </div>
          <div className="fixed bottom-5 right-5 flex flex-col items-end gap-3">
            
            <div className="flex flex-col items-end gap-3">
              <p
                onClick={() => {
                  toast(
                    (t) => (
                      <span className="flex gap-3">
                        Вы уверены, что хотите выйти из своей учетной записи?
                        <div className="flex items-end gap-3">
                          <button
                            className="py-1 px-4 pb-2 rounded-md text-white bg-red-500"
                            onClick={() => {
                              toast.dismiss(t.id);
                              Cookies.remove("authToken");
                              localStorage.clear();
                              // location.pathname = `https://joinposter.com/api/auth?application_id=3629&redirect_uri=${
                              //   import.meta.env.VITE_BACKEND
                              // }/auth&response_type=code`;
                              window.location.href = `https://joinposter.com/api/auth?application_id=3629&redirect_uri=${
                                import.meta.env.VITE_BACKEND
                              }/auth&response_type=code`;
                              // navigate("/")
                            }}
                          >
                            да
                          </button>
                          <button
                            className="py-1 px-4 pb-2 rounded-md border border-gray-500"
                            onClick={() => toast.dismiss(t.id)}
                          >
                            нет
                          </button>
                        </div>
                      </span>
                    ),
                    {
                      duration: 10000,
                      icon: "❓",
                      style: {
                        minWidth: "500px",
                      },
                    }
                  );
                }}
                className="inline-flex items-center gap-2 rounded-md bg-red-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Выйти
              </p>
              <p
                onClick={() => {
                  toast(
                    (t) => (
                      <span className="flex gap-3">
                        Связаться с нами <br />
                        {`+998(93) 520-40-50 Хабибуллох`}
                        <div className="flex items-end gap-3">
                          <button
                            className="py-1 px-4 pb-2 rounded-md border border-gray-500"
                            onClick={() => toast.dismiss(t.id)}
                          >
                            Отмена
                          </button>
                        </div>
                      </span>
                    ),
                    {
                      duration: 10000,
                      icon: "☎",
                    }
                  );
                }}
                className="inline-flex items-center gap-2 rounded-md bg-blue-500/50 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Тех. поддержка
              </p>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default App;
