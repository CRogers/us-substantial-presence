package presence.pages;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;
import net.serenitybdd.screenplay.targets.Target;

public class PresenceTest implements Question<SubstantialPresence> {
    private static final Target RESULT = Target
        .the("substantial presence test result")
        .locatedBy(".test-result");


    @Override
    public SubstantialPresence answeredBy(Actor actor) {
        String result = Text.of(RESULT)
            .viewedBy(actor)
            .asString();

        if (result.contains("not")) {
            return SubstantialPresence.DOES_NOT_HAVE;
        } else {
            return SubstantialPresence.HAS;
        }
    }

    public static PresenceTest result() {
        return new PresenceTest();
    }
}
