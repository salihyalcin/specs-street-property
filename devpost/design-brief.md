---
status: approved
---

# Design brief: Street Property Information (default)

## The one spatial moment
A user is walking along a street and looking at a building through their glasses. A numbered circle shows that apartments in the building are available for sale or rent; the user pinches it to reveal markers at the apartments' actual floor positions, then opens one apartment's information.

## Why it belongs on glasses
- Uses: shares the user's view, draws information on the building it describes, and leaves the user's eyes up while walking.
- Why it's better than the phone or laptop version: the user does not need to stop, search for an address, or match a listing to a façade; the availability markers appear at the relevant apartments.

## Product or overlay
- Type: overlay: it responds to a real building and apartments on its façade.
- What the real version would sense: which building the user is looking at, which apartments have listings, where those apartments sit on the façade, and whether the building remains in view.
- Stand-in for the preview: a solid vertical rectangle represents the building. It contains three hard-coded apartment listings on the 1st, 3rd, and 8th floors and simulates building recognition and sample listing data.

## Where things live
- Where the user is looking during the main task: toward the solid building façade while walking through the simulated street.
- Building stand-in: a solid vertical rectangle, about 600 cm wide by 900 cm tall (default), placed on the virtual ground about 800 cm in front of the starting viewpoint (default).
- Cluster marker: a filled circle about 35 cm in diameter (default), anchored at the center point between the three listed apartments on the façade. It displays the number `3`.
- Apartment markers: filled circles about 30 cm in diameter (default), anchored just above the apartment positions on the 1st, 3rd, and 8th floors.
- Listing card: a filled rectangle about 100 cm wide by 65 cm tall (default), opening beside the selected apartment marker and connected to it by a visible line. It shows sale or rent status, room count, floor, bathroom count, and price using hard-coded sample data (default).

## Hands and input
- Expand the cluster: aim at the numbered circle and pinch to press it.
- Open a listing: aim at an individual apartment circle and pinch to press it.
- Close a listing: pinch one large close button on the listing card.
- Targets are big and highlight when aimed at.
- Voice (if any) and the button that does the same job: none.

## When things show
- Cluster marker: shows when the building façade is in view, and hides when the user looks away or walks past the building.
- Apartment markers: show after the cluster marker is pinched, scattering from the cluster center to the 1st-, 3rd-, and 8th-floor apartment positions. They hide when the building leaves view.
- Listing card: shows after an apartment marker is pinched. It hides when its close button is pinched or when the building leaves view.
- If something needs attention out of view: none.

## Done criteria
Each one can be checked in Lens Studio's preview.
1. The scene opens in Interactive Preview, and the user can walk through the simulated street and see the solid building stand-in.
2. Looking toward the building shows one filled cluster circle with the number `3`; looking or walking away hides it.
3. Pinching the cluster circle animates three markers from the cluster center to the 1st-, 3rd-, and 8th-floor positions.
4. Pinching the 1st-floor marker opens a filled rectangular card connected to that marker by a line, showing its sale or rent status, room count, floor, bathroom count, and price.
5. Pinching the card's close button hides the card, and the apartment markers remain available while the building is still in view.

## Out of scope
- Recognizing real buildings or apartments from live camera images.
- Live real-estate listings, network data, address search, maps, or walking directions.
- Persistent spatial anchors or remembering listings between sessions.
- More than one building in this preview demonstration.

## Risks and open questions
- Real building recognition, accurate façade-to-apartment alignment, and live listing availability are represented by hard-coded stand-ins rather than proven in the preview.
- Readability and comfort when markers are attached to high floors are feel unproven without real glasses.
- The exact visual style, colors, and sample property values were not chosen and can use readable defaults that work on an additive display.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
