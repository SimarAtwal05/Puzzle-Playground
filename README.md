# Puzzle Playground

**Puzzle Playground** is a web application featuring classic puzzle games powered by a rule-based AI. It provides a simple and clean interface where users can challenge an AI in strategic games like **Tic Tac Toe** and **Dots and Boxes**.

---

## ✨ Features
- **Two Classic Games**: Play either Tic Tac Toe or Dots and Boxes.  
- **Rule-Based AI**: Opponents follow a predefined, hierarchical set of rules, making gameplay challenging yet predictable.  
- **Dynamic UI**: Game boards are generated dynamically using JavaScript.  
- **Clean Interface**: Multi-page layout for smooth navigation from the home page to the game library.  
- **Pure Front-End**: Runs entirely in the browser using **HTML, CSS, and JavaScript** (no server needed).  

---

## 🎮 How to Play
1. Open `index.html` in your web browser.  
2. Click **Start Playing** to go to the game library.  
3. Select **Tic Tac Toe** or **Dots and Boxes** and click **Play**.  
4. Follow the on-screen prompts to make your moves.  

---

## 📂 Project Structure
```
Puzzle-Playground/
├── index.html  # Main landing page
├── library.html  # Game selection screen
├── solver.html  # Game board and logic
├── styles.css  # Global stylesheet
├── script.js  # Core JavaScript logic + AI
├── tictactoe_rules.xml  # RuleML definition (not parsed in current version)
├── dots_rules.xml  # RuleML definition (not parsed in current version)
```

---

## 🧠 AI Logic

### Tic Tac Toe AI Rules (priority order):
1. **Win** – Take a winning move if available.  
2. **Block** – Prevent the player from winning.  
3. **Take Center** – Occupy the center if free.  
4. **Take Corner** – Choose a corner square.  
5. **Take Side** – Choose a side square.  

### Dots and Boxes AI Rules (priority order):
1. **Complete a Box** – Draw a line to complete a box.  
2. **Safe Move** – Draw a line that avoids giving the opponent a box.  
3. **Losing Move** – If unavoidable, give a box but minimize damage.  
4. **Random Move** – Choose any remaining valid line.  

---

## 🚀 Future Improvements
- Add more puzzle games (e.g., Connect Four, Sudoku).  
- Externalize AI rules into XML/RuleML for easier modification.  
- Add difficulty levels by adjusting rule priorities.  

---

### ✅ Conclusion
Puzzle Playground provides a lightweight, browser-based way to enjoy classic puzzle games with a transparent and beatable AI.  
