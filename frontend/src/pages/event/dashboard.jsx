import HeroSlider from "../../components/autoSlider";
import EventCard from "../../components/eventCard"
import cover from "../../assets/images/cover.jpg"
//demo 

const sampleEvent = {
  image: cover,
  title: "React Conference 2025",
  description: "Join the biggest React conference with top speakers, workshops, and networking opportunities.",
  dateTime: "Dec 10, 2025 - 10:00 AM",
  location: "Dhaka, Bangladesh"
};
//demo





const Dashboard = () => {
  return (
    <div>
      <HeroSlider />
        <h1 className="w-full text-left text-cherry font-extrabold text-4xl md:text-5xl lg:text-6xl my-8 border-l-4 border-cherry pl-4" >
          All Events
        </h1>
    
          <div className="flex flex-wrap gap-6 p-6 justify-start">
          <EventCard event={sampleEvent} />
          <EventCard event={sampleEvent} />
          <EventCard event={sampleEvent} />
          </div>
    
    </div>

  );
};

export default Dashboard;
