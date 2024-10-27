export const heavyCalculation = (): number => {
  let result = 0;
  for (let i = 0; i < 2e7; i++) {
    result += Math.sqrt(i) * Math.sin(i) * Math.cos(i % 1000);
  }
  return result;
};

export const getImageAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');

    const imageData = await response.arrayBuffer();
    return Buffer.from(imageData).toString('base64');
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
};

export async function messageCensorship(message: string): Promise<boolean> {
  const prohibitedWords = [
    "child", "childporn", "cp", "pedo", "scat", "zoophilia", "animal abuse",
  ];
  const prohibitedPattern = new RegExp(`\\b(${prohibitedWords.join("|")})\\b`, "i");
  return !prohibitedPattern.test(message);
}
