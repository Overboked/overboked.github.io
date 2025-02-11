// Функция для создания сцены
const createScene = function (canvas, modelUrl) {
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Настройка чувствительности колесика мыши
    camera.wheelDeltaPercentage = 0.01; // Уменьшите это значение для снижения чувствительности

    // Предотвращение прокрутки страницы при взаимодействии с моделью
    canvas.addEventListener("wheel", function(event) {
        event.preventDefault(); // Предотвращает прокрутку страницы
    });

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;

    BABYLON.SceneLoader.Append("", modelUrl, scene, function (scene) {
        // Действия после загрузки модели
    }, null, ".glb");

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener("resize", function () {
        engine.resize();
    });
};

// Инициализация сцен для каждой модели
createScene(document.getElementById("renderCanvas1"), "models/model1.glb");
createScene(document.getElementById("renderCanvas2"), "models/model2.glb");
createScene(document.getElementById("renderCanvas3"), "models/model3.glb");
