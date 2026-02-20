export const updateDateTime = (setGreeting, setCurrentDate) => {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 16) setGreeting("Good Afternoon");
    else if (hours < 20) setGreeting("Good Evening");
    else setGreeting("Good Night");

    const options = {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
    };
    setCurrentDate(`Today is ${now.toLocaleDateString("en-US", options)}`);
};