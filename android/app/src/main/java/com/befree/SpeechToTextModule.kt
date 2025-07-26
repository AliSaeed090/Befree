package com.reactnativebefreee

import android.Manifest
import android.content.pm.PackageManager
import android.speech.RecognitionListener
import android.speech.SpeechRecognizer
import android.speech.RecognizerIntent
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

class SpeechToTextModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), PermissionListener {
    private var speechRecognizer: SpeechRecognizer? = null
    private var speechCallback: Promise? = null
    private val PERMISSION_REQUEST_CODE = 1
    private val mainHandler = Handler(Looper.getMainLooper())

    override fun getName(): String {
        return "SpeechToText"
    }

    @ReactMethod
    fun startListening(locale: String, promise: Promise) {
        mainHandler.post {
            val currentActivity = currentActivity
            
            if (currentActivity == null) {
                promise.reject("ERROR", "Activity not found")
                return@post
            }

            if (currentActivity.checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                speechCallback = promise
                (currentActivity as PermissionAwareActivity).requestPermissions(
                    arrayOf(Manifest.permission.RECORD_AUDIO),
                    PERMISSION_REQUEST_CODE,
                    this
                )
                return@post
            }

            startRecognition(locale, promise)
        }
    }

    private fun startRecognition(locale: String, promise: Promise) {
        try {
            speechCallback = promise
            
            // Ensure we're on main thread
            mainHandler.post {
                try {
                    speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext)
                    
                    speechRecognizer?.setRecognitionListener(object : RecognitionListener {
                        override fun onResults(results: Bundle?) {
                            val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                            if (matches != null && matches.isNotEmpty()) {
                                speechCallback?.resolve(matches[0])
                            } else {
                                speechCallback?.reject("ERROR", "No speech result")
                            }
                            cleanup()
                        }

                        override fun onError(error: Int) {
                            speechCallback?.reject("ERROR", "Speech recognition error: $error")
                            cleanup()
                        }

                        override fun onReadyForSpeech(params: Bundle?) {}
                        override fun onBeginningOfSpeech() {}
                        override fun onRmsChanged(rmsdB: Float) {}
                        override fun onBufferReceived(buffer: ByteArray?) {}
                        override fun onEndOfSpeech() {}
                        override fun onPartialResults(partialResults: Bundle?) {}
                        override fun onEvent(eventType: Int, params: Bundle?) {}
                    })

                    val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, locale)
                    intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)

                    speechRecognizer?.startListening(intent)
                } catch (e: Exception) {
                    promise.reject("ERROR", e.message ?: "Unknown error occurred")
                    cleanup()
                }
            }
            
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
            cleanup()
        }
    }

    @ReactMethod
    fun stopListening() {
        mainHandler.post {
            cleanup()
        }
    }

    private fun cleanup() {
        mainHandler.post {
            speechRecognizer?.destroy()
            speechRecognizer = null
            speechCallback = null
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray): Boolean {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                speechCallback?.let { promise ->
                    startRecognition("en-US", promise)
                }
            } else {
                speechCallback?.reject("ERROR", "Permission denied")
                cleanup()
            }
            return true
        }
        return false
    }
}