import  { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import "./styles/footer.css";

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const footerRef = useRef(null); // Reference for the footer

  useEffect(() => {
    // GSAP Animation for the footer
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 50 }, // Initial state: hidden and moved down
      {
        opacity: 1,
        y: 0, // Final state: visible and at its original position
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: footerRef.current, // Trigger when the footer enters the viewport
          start: "top 90%", // Start animation when top of footer is at 90% of the viewport
          end: "top 50%", // End animation when top of footer reaches 50% of the viewport
          scrub: false, // No scrubbing, the animation plays once
          toggleActions: "play none none none", // Play on entering, no reverse
        },
      }
    );
  }, []);

  return (
    <div className="footer" ref={footerRef}>
      <footer>
        <p>&copy; 2024 Your Company. All rights reserved.</p>
        <p>
          <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a>
        </p>
        <p>Join with us on <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></p>
        <p>Follow us on <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></p>
        <p>Contact us at <a href="https://www.linkedin.com">LinkedIn</a></p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, autem a qui neque ipsa vitae perferendis facilis debitis, impedit inventore dicta quo illum consequuntur porro vel modi, at earum aut.
        Nostrum, accusantium facere. Dignissimos dolor earum quos nisi labore quia et voluptas? Assumenda minus vitae nesciunt expedita, veniam dicta odio dolore laborum cupiditate tenetur eum. Autem quaerat quae voluptatem aliquid.
        Sequi exercitationem hic veritatis provident mollitia maiores odio delectus voluptas animi, cumque rem praesentium nesciunt! Ratione, voluptatem quibusdam voluptate aspernatur nulla architecto aut laudantium odio doloribus molestiae ad non. Incidunt!
        Exercitationem ex repellendus officiis voluptatibus modi quidem ea possimus voluptatum, minima ad, necessitatibus in sed provident, unde earum eius ab quas esse nesciunt assumenda itaque dolore. Mollitia iusto molestias porro?
        Quia quod quos incidunt quaerat veritatis ex nulla accusantium cum dolor voluptas ad, tempora molestias aut! Aliquam repudiandae accusantium, omnis perspiciatis ad quibusdam qui voluptatibus sequi in nobis dolor repellat?
        Odit consectetur, animi autem fugiat non, doloremque eaque deleniti fugit ducimus amet velit veniam. Unde harum soluta quas maxime ratione ipsa dignissimos mollitia, ullam pariatur, blanditiis deserunt porro eius. Veritatis!
        Corrupti rerum consequatur ipsum cupiditate omnis quisquam, maiores fugit eaque repudiandae? Cupiditate eligendi est illo, itaque fugiat aliquam iste perspiciatis sit debitis exercitationem, fuga ipsa porro consequuntur pariatur? Saepe, quo?
        Molestias deleniti soluta provident facilis, eum possimus quod numquam distinctio omnis labore ad aut harum suscipit modi repellendus! Maxime perspiciatis adipisci ut voluptas eligendi. Animi fuga quidem nesciunt reiciendis iste.
        Sapiente eos omnis eius repellendus provident iure placeat sed temporibus quo beatae. Nam harum sit in esse, recusandae officia quibusdam illo? Recusandae veritatis optio eveniet iure voluptates accusamus deserunt natus?
        Eligendi voluptate ut iste odio facilis vitae, quidem cumque? Deleniti maxime numquam a expedita quos. Fuga in molestias ipsum quas, nemo saepe et repudiandae rem veritatis praesentium consectetur asperiores animi!
        Aperiam neque recusandae mollitia optio atque at corporis natus, quas placeat dolores ullam nostrum illo aliquam! Iste, iure ipsam? Ducimus impedit, omnis quis asperiores dolores dolorum quos eaque iure? A.
        Illo labore dolorum vero veniam excepturi dignissimos! Placeat soluta repellendus dignissimos corporis, eos porro nesciunt ab laboriosam nulla distinctio excepturi voluptatibus atque voluptatem fugit libero incidunt, animi eaque repudiandae cum.
        Aliquid dolore natus, consequuntur voluptates est perspiciatis ab alias exercitationem nobis consectetur esse suscipit ad debitis aut deleniti reprehenderit facilis eaque perferendis voluptatem explicabo tempora, libero at enim unde. Officia?
        Esse sunt excepturi voluptate obcaecati quibusdam harum eum rerum, ad molestiae numquam quas ab itaque. Cupiditate consequatur eos laboriosam, fuga blanditiis aspernatur sapiente ullam eius dolorem quae aut nisi temporibus.
        Numquam earum omnis expedita rerum, distinctio, ipsa rem eius explicabo repellat aut recusandae accusamus odio at! Voluptatem, eum ullam? Amet numquam error odit ipsa, magni debitis doloribus! Accusantium, quibusdam eius.
        Veritatis assumenda harum corrupti similique omnis dignissimos quo voluptas recusandae vero praesentium rerum ipsam voluptatum deleniti quod, fugit, quasi dolor alias nostrum asperiores possimus facilis! Quisquam doloribus corporis illum. Laudantium.
        Animi expedita labore tenetur fugiat dolorum impedit nemo aut possimus odio incidunt dignissimos dolorem molestias enim saepe nesciunt itaque, officia inventore qui totam. Excepturi eum fuga modi error beatae dolorem!
        Aspernatur mollitia beatae a in est? Praesentium, ad dignissimos itaque, nesciunt incidunt fugit delectus quia maiores, cumque fuga vero. Tempora earum ex minus impedit velit nobis, non iusto deserunt maiores?
        Assumenda molestias ut officiis minima officia dolorem est, deleniti quibusdam nihil dolorum iusto, magni itaque consequatur, corrupti dignissimos laborum earum reiciendis. Repellendus error accusantium rem natus iste, corporis porro at?
        Eligendi nesciunt voluptate ad, aliquam delectus dignissimos ducimus aliquid quae inventore modi sed. Corporis inventore rem illum nesciunt blanditiis magni aperiam quam, iure omnis magnam quisquam. Ad tempora pariatur ea.</p>
      </footer>
    </div>
  );
}

export default Footer;
