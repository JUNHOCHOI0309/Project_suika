import hamster from "../assets/hamster.png";
import Squirrel from "../assets/squirrel.png";
import rabbit from "../assets/rabbit.png";
import duck from "../assets/duck.png";
import dog from "../assets/dog.png";
import penguin from "../assets/penguin.png";
import deer from "../assets/deer.png";
import dolphin from "../assets/dolphin.png";
import bear from "../assets/bear.png";
import elephant from "../assets/elephant.png";
import whale from "../assets/whale.png";

export const fruitRadiusMap: Record<number,{ radius: number, score : number, image: string, backgroundcolor: string}> = {
        1:{ radius: 10, score : 100, image: hamster, backgroundcolor: '#ffefef' },
        2:{ radius: 20, score : 200, image: Squirrel, backgroundcolor: '#ffe3e3' },
        3:{ radius: 30, score : 300, image: rabbit, backgroundcolor: '#ffdada' },
        4:{ radius: 40, score : 500, image: duck, backgroundcolor: '#ffd3b6' },
        5:{ radius: 50, score : 1000, image: dog, backgroundcolor: '#fffacc' },
        6:{ radius: 60, score : 2000, image: penguin, backgroundcolor: '#d0f0c0' },
        7:{ radius: 70, score : 4000, image: deer , backgroundcolor: '#c6e2ff'},
        8:{ radius: 80, score : 8000, image: dolphin, backgroundcolor:'#dbcdf0' },
        9:{ radius: 90, score : 16000, image: bear , backgroundcolor: '#f7c8e0'},
        10:{ radius: 100, score : 32000, image: elephant , backgroundcolor:'#f9c5a0' },
        11:{ radius: 110, score : 64000, image: whale, backgroundcolor:'#ffe0ac' },
};

export function getRandomFruitID(): number {
        const posiblieIDs = [1,2,3,4,5];
        const randomIndex = Math.floor(Math.random() * posiblieIDs.length);
        return posiblieIDs[randomIndex];
}