import Nav from "@/components/features/landingPage/Nav";
import MainPart from "@/components/features/landingPage/MainPart";
import Features from "@/components/features/landingPage/Features";
import HowItWorks from "@/components/features/landingPage/HowItWorks";
import Feedbacks from "@/components/features/landingPage/FeedBacks";
import ReadyToget from "@/components/features/landingPage/ReadyToget";
import Footer from "@/components/features/landingPage/Footer";



export default function Home() {
  return (
    <main>
      <Nav/>
      <MainPart/>
      <Features/>
      <HowItWorks/>
      <Feedbacks/>
      <ReadyToget/>
      <Footer/>
    </main>

  );
}
