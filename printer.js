document.addEventListener("keypress", async (event) => {
    if (event.key != "p")
        return;

    const width = "8.5in";
    const height = "11in";

    const planning = "These directions are for planning";

    function sleep(s) {
        var sleepTime = 1000;
        return new Promise(resolve => setTimeout(resolve, sleepTime));
    }

    const body = document.querySelector("body");
    const content = document.querySelector("#content-container");
    const app = document.querySelector("#app-container");
    const scene = document.querySelector("#scene");

    var status = content.getAttribute("status");
    if (status == "pending")
        return;
    if (status == "ready") {
        print();
        return;
    }

    content.querySelectorAll("span").forEach((span) => {
        if (!span.textContent.includes(planning))
            return;
        status = "pending"
        content.setAttribute("status", status);
    });
    if (status != "pending") {
        return;
    }

    while (true) {
        var printWithMaps = document.querySelector('button[jsaction="pane.action.printWithMaps"]');
        if (printWithMaps)
            break;
        var printOpen = document.querySelector('button[jsaction="pane.action.printOpen"]');
        if (!printOpen)
            return;
        printOpen.click();
        await sleep();
    }
    printWithMaps.click();
    await sleep();

    var printRegion = document.querySelector("#print");
    printRegion.remove();
    await sleep();

    var directions = null;
    content.querySelectorAll("div").forEach((div) => {
        if (directions)
            return;
        if (window.getComputedStyle(div).position != "absolute")
            return;
        div.querySelectorAll("span").forEach((span) => {
            if (directions)
                return;
            if (!span.textContent.includes(planning))
                return;
            span.remove();
            directions = div;
        });
    });

    directions.remove();
    directions.style.position = "static";
    directions.style.width = width;
    body.appendChild(directions);
    await sleep();

    app.style.width = width;
    app.style.height = height;
    scene.style.width = width;
    scene.style.height = height;
    await sleep();

    window.dispatchEvent(new Event("resize"));
    await sleep();

    status = "ready"
    content.setAttribute("status", status);
});
