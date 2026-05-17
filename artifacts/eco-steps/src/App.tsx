import { useState } from "react";
import { Toaster } from "sonner";
import { SCENES } from "@/data/game-data";
import { Lang } from "@/i18n";
import StartScreen from "@/screens/StartScreen";
import SceneWrapper from "@/screens/SceneWrapper";
import EndScreen from "@/screens/EndScreen";
import LightsScene from "@/scenes/LightsScene";
import TrashScene from "@/scenes/TrashScene";
import TapsScene from "@/scenes/TapsScene";

type Screen = "start" | "game" | "end";

const MAX_POINTS = 260;

export default function App() {
  const [screen, setScreen]         = useState<Screen>("start");
  const [playerName, setPlayerName] = useState("");
  const [lang, setLang]             = useState<Lang>("pt");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const handleStart = (name: string, chosenLang: Lang) => {
    setPlayerName(name);
    setLang(chosenLang);
    setSceneIndex(0);
    setTotalPoints(0);
    setScreen("game");
  };

  const handleSceneComplete = (points: number) => {
    const newTotal = totalPoints + points;
    setTotalPoints(newTotal);
    const next = sceneIndex + 1;
    if (next >= SCENES.length) {
      setScreen("end");
    } else {
      setSceneIndex(next);
    }
  };

  const currentScene = SCENES[sceneIndex];

  const sceneProps = {
    onComplete: handleSceneComplete,
    totalPoints,
    sceneIndex,
    totalScenes: SCENES.length,
    lang,
  };

  const renderScene = () => {
    if (currentScene.id === "lights") return <LightsScene {...sceneProps} />;
    if (currentScene.id === "trash")  return <TrashScene  {...sceneProps} />;
    if (currentScene.id === "taps")   return <TapsScene   {...sceneProps} />;
    return null;
  };

  return (
    <>
      {screen === "start" && (
        <StartScreen onStart={handleStart} />
      )}

      {screen === "game" && currentScene && (
        <SceneWrapper
          scene={currentScene}
          sceneIndex={sceneIndex}
          totalScenes={SCENES.length}
          totalPoints={totalPoints}
          lang={lang}
        >
          {renderScene()}
        </SceneWrapper>
      )}

      {screen === "end" && (
        <EndScreen
          playerName={playerName}
          totalPoints={totalPoints}
          maxPoints={MAX_POINTS}
          lang={lang}
          onRestart={() => setScreen("start")}
        />
      )}

      <Toaster richColors position="top-center" />
    </>
  );
}
