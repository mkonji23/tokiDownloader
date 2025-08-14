import fs from "fs";
import path from "path";
import readline from "readline";

// ES 모듈에서 __dirname 대체
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "📂 TXT 파일들이 있는 디렉토리 경로를 입력하세요: ",
  (inputPath) => {
    const folderPath = path.resolve(inputPath);

    try {
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".txt"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); // 숫자 순 정렬

      if (files.length === 0) {
        console.log("❌ 해당 디렉토리에 txt 파일이 없습니다.");
        rl.close();
        return;
      }

      // 첫 번째와 마지막 파일명(확장자 제거)
      const firstName = path.basename(files[0], ".txt");
      const lastName = path.basename(files[files.length - 1], ".txt");

      // 제목 생성
      const outputFile = path.join(
        folderPath,
        `${firstName} ~ ${lastName}.txt`
      );

      let mergedContent = "";

      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const content = fs.readFileSync(filePath, "utf-8");

        mergedContent += `=== ${path.basename(file, ".txt")} ===\n`;
        mergedContent += content + "\n\n";
      });

      fs.writeFileSync(outputFile, mergedContent, "utf-8");
      console.log(`✅ 병합 완료: ${outputFile}`);
    } catch (err) {
      console.error("❌ 에러 발생:", err.message);
    }

    rl.close();
  }
);
