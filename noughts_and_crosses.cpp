#include <iostream>
#include <array>
#include <string>

using Board = std::array<char, 9>;

void printBoard(const Board& b) {
    std::cout << "\n";
    for (int i = 0; i < 9; i++) {
        std::cout << " " << b[i];
        if (i % 3 < 2) std::cout << " |";
        else if (i < 8) std::cout << "\n---+---+---\n";
    }
    std::cout << "\n\n";
}

char checkWinner(const Board& b) {
    const int lines[8][3] = {
        {0,1,2},{3,4,5},{6,7,8}, // rows
        {0,3,6},{1,4,7},{2,5,8}, // cols
        {0,4,8},{2,4,6}          // diagonals
    };
    for (auto& line : lines) {
        if (b[line[0]] != ' ' &&
            b[line[0]] == b[line[1]] &&
            b[line[1]] == b[line[2]])
            return b[line[0]];
    }
    return ' ';
}

bool isFull(const Board& b) {
    for (char c : b) if (c == ' ') return false;
    return true;
}

int getMove(const Board& b, char player) {
    int move;
    while (true) {
        std::cout << "Player " << player << ", enter position (1-9): ";
        if (!(std::cin >> move)) {
            std::cin.clear();
            std::cin.ignore(1000, '\n');
            std::cout << "Invalid input. Try again.\n";
            continue;
        }
        move--;
        if (move < 0 || move > 8 || b[move] != ' ')
            std::cout << "That position is taken or invalid. Try again.\n";
        else
            return move;
    }
}

bool playAgain() {
    char c;
    std::cout << "Play again? (y/n): ";
    std::cin >> c;
    return c == 'y' || c == 'Y';
}

int main() {
    std::cout << "=== Noughts and Crosses ===\n";
    std::cout << "Positions:\n 1 | 2 | 3\n---+---+---\n 4 | 5 | 6\n---+---+---\n 7 | 8 | 9\n";

    do {
        Board board;
        board.fill(' ');
        char current = 'X';

        while (true) {
            printBoard(board);
            int move = getMove(board, current);
            board[move] = current;

            char winner = checkWinner(board);
            if (winner != ' ') {
                printBoard(board);
                std::cout << "Player " << winner << " wins!\n";
                break;
            }
            if (isFull(board)) {
                printBoard(board);
                std::cout << "It's a draw!\n";
                break;
            }
            current = (current == 'X') ? 'O' : 'X';
        }
    } while (playAgain());

    std::cout << "Thanks for playing!\n";
    return 0;
}
