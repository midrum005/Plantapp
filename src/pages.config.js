import AddPlant from './pages/AddPlant';
import EditPlant from './pages/EditPlant';
import Home from './pages/Home';
import PlantDetail from './pages/PlantDetail';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AddPlant": AddPlant,
    "EditPlant": EditPlant,
    "Home": Home,
    "PlantDetail": PlantDetail,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};