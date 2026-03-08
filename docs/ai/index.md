# AI Features Setup

## OpenAI API Key Configuration

To enable AI-powered features in the chat, you need to set up your OpenAI API key:

### 1. Get your OpenAI API Key

- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Copy the key

### 2. Add to Environment Variables

Create a `.env.local` file in your project root and add:

```bash
# Server-side usage (secure - API key stays on server)
OPENAI_API_KEY=your_openai_api_key_here
```

**Important**: We use server actions for security, so the API key is never exposed to the client side.

### 3. Available AI Features

The chat now includes these AI-powered features:

- **✏️ Proofread**: Improve grammar and make messages more professional
- **💬 Generate Inquiry**: Create professional inquiry messages
- **💰 Price Negotiation**: Generate polite negotiation messages
- **📅 Meeting Request**: Ask to arrange meetings to view items
- **🌐 Translate**: Translate messages to other languages

### 4. Usage

1. Open any chat conversation
2. Click the sparkles (✨) button next to the message input
3. Select an AI feature from the popover
4. The AI will generate or improve your message
5. Review and send the message

### 5. Notes

- AI features require an active internet connection
- OpenAI API usage may incur costs based on your plan
- The AI service includes error handling and fallbacks
- All features are designed for classified ads buyer-seller communication

### 6. Cost Optimization

- **Model Used**: GPT-3.5-turbo (most cost-effective option)
- **Token Limits**: Optimized to minimize costs (100-150 tokens per request)
- **Server Actions**: More efficient than API routes, reducing overhead

### 7. Troubleshooting

If AI features don't work:

- Check your API key is correctly set in `.env.local` (no NEXT*PUBLIC* prefix needed)
- Verify you have credits in your OpenAI account
- Check browser console for any error messages
- Ensure your internet connection is stable
- Make sure the server actions are properly imported
